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

export default class RetrieveWorkflows extends SfdxCommand
{
    public static description = messages.getMessage('metadata.retrieve.workflows.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        let workflowResults = <QueryResult<MetadataResult>>await conn.tooling.query(`SELECT TableEnumOrId FROM WorkflowRule`);

        let results = this.prepareResults(workflowResults);

        let retrieveHelper = new RetrieveHelper();

        retrieveHelper.retrieveWorkflows(results, org.getUsername(), conn.getApiVersion());

        return null;
    }


    private prepareResults(workflowResults: QueryResult<MetadataResult>): QueryResult<MetadataResult>
    {
        workflowResults.records.forEach(workflow =>
        {
            if (!workflow.Folder)
            {
                workflow.Folder = { Name: null, DeveloperName: 'unfiled$public' }
            }
        });

        return workflowResults;
    }
}
