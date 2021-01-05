import { exec } from 'child_process';
import PackageHelper from './PackageHelper';

export default class RetrieveHelper
{
    public retrieveUsingSFDX(username, packageXmlFilePath, metadataType): Promise<void>
    {
        let sfdxCommand = `sfdx force:source:retrieve -u ${username} -x ${packageXmlFilePath}`;

        console.log(`Retrieving ${metadataType}s...`);

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

    public retrieveMetadata(results, username, apiVersion, metadataType): void
    {
        try
        {
            let packageHelper = new PackageHelper();

            let packageXmlFilePath = packageHelper.createPackageXmlFile(results, metadataType, apiVersion);

            this.retrieveUsingSFDX(username, packageXmlFilePath, metadataType);
        }
        catch (e)
        {
            console.log(e);
        }
    }


    public retrieveDashboards(results, username, apiVersion)
    {
        this.retrieveMetadata(results, username, apiVersion, 'Dashboard');
    }


    public retrieveEmailTemplates(results, username, apiVersion)
    {
        this.retrieveMetadata(results, username, apiVersion, 'EmailTemplate');
    }


    public retrieveReports(results, username, apiVersion)
    {
        this.retrieveMetadata(results, username, apiVersion, 'Report');
    }

    public retrieveWorkflows(results, username, apiVersion)
    {
        this.retrieveMetadata(results, username, apiVersion, 'Workflow');
    }
}
