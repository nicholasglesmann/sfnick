import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import FontevaCommandHelper from '../../../shared/FontevaCommandHelper';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class ValidateFull extends SfdxCommand
{
    public static description = messages.getMessage('validate.subcommands.full.description');
    public static examples = [];

    protected static flagsConfig = {
        client: flags.string({
            char: 'c',
            description: messages.getMessage('validate.subcommands.flags.client')
        })
    };

    public async run(): Promise<JsonMap>
    {
        return await FontevaCommandHelper.validateFontevaClient(this.flags.client, 'full');
    }
}
