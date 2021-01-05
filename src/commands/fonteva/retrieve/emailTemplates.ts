import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../../types/MetadataResult';
import RetrieveHelper from '../../../shared/RetrieveHelper';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('fonteva', 'fon');

export default class RetrieveEmailTemplate extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.emailTemplates.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        let emailTemplateResults = <QueryResult<MetadataResult>> await conn.query(`SELECT DeveloperName, Folder.DeveloperName FROM EmailTemplate`);

        let results = this.prepareResults(emailTemplateResults);

        let retrieveHelper = new RetrieveHelper();

        retrieveHelper.retrieveEmailTemplates(results, org.getUsername(), conn.getApiVersion());

        return null;
    }


    private prepareResults(emailTemplateResults: QueryResult<MetadataResult>): QueryResult<MetadataResult>
    {
        emailTemplateResults.records.forEach(emailTemplate =>
        {
            if (!emailTemplate.Folder)
            {
                emailTemplate.Folder = { Name: null, DeveloperName: 'unfiled$public' }
            }
        });

        return emailTemplateResults;
    }
}
