import { exec } from 'child_process';
import PackageService from './PackageService';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../types/MetadataResult';
import MetadataFolder from '../../types/MetadataFolder';
import OrgHelper from '../OrgService';

export default class RetrieveHelper
{
    static METADATA_TYPE = {
        DASHBOARD: "Dashboard",
        DOCUMENT:"Document",
        EMAIL_TEMPLATE: "EmailTemplate",
        REPORT: "Report",
        WORKFLOW: "Workflow"
    }

    static METADATA_QUERY = {
        DASHBOARD: "SELECT DeveloperName, Folder.DeveloperName FROM Dashboard",
        DOCUMENT: "SELECT DeveloperName, Folder.DeveloperName FROM Document",
        EMAIL_TEMPLATE: "SELECT DeveloperName, Folder.DeveloperName FROM EmailTemplate",
        REPORT: "SELECT DeveloperName, FolderName FROM Report",
        REPORT_FOLDER: "SELECT Name, DeveloperName FROM Folder WHERE Type = 'Report'",
        WORKFLOW: "SELECT TableEnumOrId FROM WorkflowRule",
        WORKFLOW_ALERT: "SELECT EntityDefinitionId FROM WorkflowAlert",
        WORKFLOW_ALERT_OBJECT: "SELECT NamespacePrefix, DeveloperName From CustomObject"
    }

    static retrieveUsingSFDX(username, packageXmlFilePath, metadataType): Promise<void>
    {
        let sfdxCommand = `sfdx force:source:retrieve -u ${username} -x ${packageXmlFilePath}`;

        console.log(`Retrieving ${metadataType}s from ${username}...`);

        return new Promise((resolve, reject) =>
        {
            exec(sfdxCommand, (error, data, stderr) =>
            {
                if (error) { reject(error); }

                if (stderr) { reject(stderr); }

                resolve(data);
            });
        })
        .then(data =>
        {
            console.log(`${metadataType}s retrieved!`);
        })
        .catch(error =>
        {
            console.log(`Error retrieving ${metadataType}: ${error}`);
        });
    }


    static async retrieveMetadata(results, username, apiVersion, metadataType): Promise<void>
    {
        try
        {
            let packageHelper = new PackageService();

            let packageXmlFilePath = await packageHelper.createPackageXmlFile(results, metadataType, apiVersion);

            return RetrieveHelper.retrieveUsingSFDX(username, packageXmlFilePath, metadataType);
        }
        catch (e)
        {
            console.log(e);
        }
    }


    static async retrieveDashboards(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFromUsername(username);

        let dashboardResults = <QueryResult<MetadataResult>> await conn.query(RetrieveHelper.METADATA_QUERY.DASHBOARD);

        dashboardResults.records.forEach(dashboard =>
        {
            if (!dashboard.Folder)
            {
                dashboard.Folder = { Name: null, DeveloperName: null } // Ignore private dashboards, these cannont be retrieved by Metadata API
            }
        });

        return RetrieveHelper.retrieveMetadata(dashboardResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.DASHBOARD);
    }


    static async retrieveDocuments(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFromUsername(username);

        let documentResults = <QueryResult<MetadataResult>> await conn.query(RetrieveHelper.METADATA_QUERY.DOCUMENT);

        documentResults.records.forEach(document =>
        {
            if (!document.Folder)
            {
                document.Folder = { Name: null, DeveloperName: null } // Ignore private documents, these cannont be retrieved by Metadata API
            }
        });

        return RetrieveHelper.retrieveMetadata(documentResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.DOCUMENT);
    }


    static async retrieveEmailTemplates(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFromUsername(username);

        let emailTemplateResults = <QueryResult<MetadataResult>> await conn.query(RetrieveHelper.METADATA_QUERY.EMAIL_TEMPLATE);

        emailTemplateResults.records.forEach(emailTemplate =>
        {
            if (!emailTemplate.Folder)
            {
                emailTemplate.Folder = { Name: null, DeveloperName: 'unfiled$public' } // If folder is null, Email Template is in public folder
            }
        });

        return RetrieveHelper.retrieveMetadata(emailTemplateResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.EMAIL_TEMPLATE);
    }


    static async retrieveReports(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFromUsername(username);

        let folderResults = <QueryResult<MetadataFolder>> await conn.query(RetrieveHelper.METADATA_QUERY.REPORT_FOLDER);

        let reportResults = <QueryResult<MetadataResult>> await conn.query(RetrieveHelper.METADATA_QUERY.REPORT);

        let reportFolders = {};

        folderResults.records.forEach(folder =>
        {
            if (folder.Name && folder.DeveloperName)
            {
                reportFolders[folder.Name] = folder.DeveloperName;
            }
        });

        reportFolders['Public Reports'] = 'unfiled$public';

        reportResults.records.forEach(report =>
        {
            report.Folder = { Name: report.FolderName, DeveloperName: reportFolders[report.FolderName] };
        });

        return RetrieveHelper.retrieveMetadata(reportResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.REPORT);
    }


    static async retrieveWorkflows(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFromUsername(username);

        let workflowResults = <QueryResult<MetadataResult>>await conn.tooling.query(RetrieveHelper.METADATA_QUERY.WORKFLOW);

        workflowResults.records.forEach(workflow =>
        {
            workflow.DeveloperName = workflow.TableEnumOrId;
        });

        return RetrieveHelper.retrieveMetadata(workflowResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.WORKFLOW);
    }
}
