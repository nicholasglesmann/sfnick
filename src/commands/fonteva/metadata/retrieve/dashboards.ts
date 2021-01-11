import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../../../types/MetadataResult';
import RetrieveHelper from '../../../../shared/RetrieveHelper';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveDashboards extends SfdxCommand
{
    public static description = messages.getMessage('metadata.retrieve.dashboards.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        let dashboardResults = <QueryResult<MetadataResult>> await conn.query(`SELECT DeveloperName, Folder.DeveloperName FROM Dashboard`);

        let results = this.prepareResults(dashboardResults);

        let retrieveHelper = new RetrieveHelper();

        retrieveHelper.retrieveDashboards(results, org.getUsername(), conn.getApiVersion());

        return null;
    }

    private prepareResults(dashboardResults: QueryResult<MetadataResult>): QueryResult<MetadataResult>
    {
        dashboardResults.records.forEach(dashboard =>
        {
            if (!dashboard.Folder)
            {
                dashboard.Folder = { Name: null, DeveloperName: null } // Ignore private dashboards, these cannont be retrieved by Metadata API
            }
        });

        return dashboardResults;
    }
}
