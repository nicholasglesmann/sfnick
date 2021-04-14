import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import SfdxHelper from '../../shared/SfdxHelper';
import UsernameHelper from '../../shared/UsernameHelper';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class Validate extends SfdxCommand
{
    public static description = messages.getMessage('validate.description');
    public static examples = [];

    static supportsUsername = true;

    public async run(): Promise<JsonMap>
    {
        let username = await UsernameHelper.getFlagOrDefaultUsername(this.flags.targetusername);

        return SfdxHelper.forceSourceValidate(username);
    }
}