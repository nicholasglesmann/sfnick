import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import DataMoverHelper from '../../../shared/DataMoverHelper';
import UsernameHelper from '../../../shared/UsernameHelper';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveData extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.data.description');
    public static examples = [];

    static supportsUsername = true;

    public async run(): Promise<any>
    {
        let username = await UsernameHelper.getFlagOrDefaultUsername(this.flags.targetusername);

        return DataMoverHelper.retrieve(username);
    }
}
