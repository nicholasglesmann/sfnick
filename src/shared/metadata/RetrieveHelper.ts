import { exec } from 'child_process';
import PackageHelper from './PackageHelper';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../types/MetadataResult';
import MetadataFolder from '../../types/MetadataFolder';
import OrgHelper from '../OrgHelper';

export default class RetrieveHelper
{
    static METADATA_TYPE = {
        DASHBOARD: "Dashboard",
        EMAIL_TEMPLATE: "EmailTemplate",
        REPORT: "Report",
        WORKFLOW: "Workflow"
    }

    static METADATA_QUERY = {
        DASHBOARD: "SELECT DeveloperName, Folder.DeveloperName FROM Dashboard",
        EMAIL_TEMPLATE: "SELECT DeveloperName, Folder.DeveloperName FROM EmailTemplate",
        REPORT: "SELECT DeveloperName, FolderName FROM Report",
        REPORT_FOLDER: "SELECT Name, DeveloperName FROM Folder WHERE Type = 'Report'",
        WORKFLOW: "SELECT TableEnumOrId FROM WorkflowRule"
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


    static retrieveMetadata(results, username, apiVersion, metadataType): Promise<void>
    {
        try
        {
            let packageHelper = new PackageHelper();

            let packageXmlFilePath = packageHelper.createPackageXmlFile(results, metadataType, apiVersion);

            return RetrieveHelper.retrieveUsingSFDX(username, packageXmlFilePath, metadataType);
        }
        catch (e)
        {
            console.log(e);
        }
    }


    static async retrieveDashboards(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFrom(username);

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


    static async retrieveEmailTemplates(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFrom(username);

        let emailTemplateResults = <QueryResult<MetadataResult>> await conn.query(RetrieveHelper.METADATA_QUERY.EMAIL_TEMPLATE);

        emailTemplateResults.records.forEach(emailTemplate =>
        {
            if (!emailTemplate.Folder)
            {
                emailTemplate.Folder = { Name: null, DeveloperName: 'unfiled$public' } // If folder is null, report is in public folder
            }
        });

        return RetrieveHelper.retrieveMetadata(emailTemplateResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.EMAIL_TEMPLATE);
    }


    static async retrieveReports(username: string): Promise<void>
    {
        const conn = await OrgHelper.getConnFrom(username);

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
        const conn = await OrgHelper.getConnFrom(username);

        let workflowResults = <QueryResult<MetadataResult>>await conn.tooling.query(RetrieveHelper.METADATA_QUERY.WORKFLOW);

        workflowResults.records.forEach(workflow =>
        {
            if (!workflow.Folder)
            {
                workflow.Folder = { Name: null, DeveloperName: 'unfiled$public' } // If folder is null, workflow is in public folder
            }
        });

        return RetrieveHelper.retrieveMetadata(workflowResults, username, conn.getApiVersion(), RetrieveHelper.METADATA_TYPE.WORKFLOW);
    }
}
