import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../../types/MetadataResult';
import RetrieveHelper from '../../../shared/RetrieveHelper';
import MetadataFolder from '../../../types/MetadataFolder';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveEmailTemplate extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.reports.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        let folderResults = <QueryResult<MetadataFolder>> await conn.query(`SELECT Name, DeveloperName FROM Folder WHERE Type = 'Report'`);

        let reportResults = <QueryResult<MetadataResult>>await conn.query(`SELECT DeveloperName, FolderName FROM Report`);

        let results = this.prepareResults(folderResults, reportResults);

        let retrieveHelper = new RetrieveHelper();

        retrieveHelper.retrieveReports(results, org.getUsername(), conn.getApiVersion());

        return null;
    }


    private prepareResults(folderResults: QueryResult<MetadataFolder>, reportResults: QueryResult<MetadataResult>): QueryResult<MetadataResult>
    {
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
            report.Folder = { Name: report.FolderName, DeveloperName: reportFolders[report.FolderName]};
        });

        return reportResults;
    }
}
