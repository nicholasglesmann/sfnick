import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import DataMoverService from '../../../shared/DataMoverService';
import UsernameService from '../../../shared/UsernameService';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class Open extends SfdxCommand
{
    public static description = messages.getMessage('open.description');
    public static examples = [];

    static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        let username = await UsernameService.getFlagOrDefaultUsername(this.flags.targetusername);

        return DataMoverService.toggleTriggersAndValidationRules(username, 'enable');
    }
}
