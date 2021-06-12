import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import RetrieveHelper from '../../../shared/metadata/RetrieveHelper';
import UsernameService from '../../../shared/UsernameService';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveDashboards extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.dashboards.description');
    public static examples = [];

    static supportsUsername = true;

    public async run(): Promise<void>
    {
        let username = await UsernameService.getFlagOrDefaultUsername(this.flags.targetusername);

        return RetrieveHelper.retrieveDashboards(username);
    }
}
