import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import RetrieveHelper from '../../../shared/metadata/RetrieveHelper';
import UsernameHelper from '../../../shared/UsernameHelper';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveEmailTemplates extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.emailTemplates.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<void>
    {
        let username = await UsernameHelper.getFlagOrDefaultUsername(this.flags.targetusername);

        return RetrieveHelper.retrieveEmailTemplates(username);
    }
}
