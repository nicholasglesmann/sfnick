import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import RetrieveHelper from '../../../../shared/metadata/RetrieveHelper';
import UsernameService from '../../../../shared/UsernameService';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveUatWorkflows extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.workflows.subcommands.uat.description');
    public static examples = [];

    protected static flagsConfig = {
        client: flags.string({
            char: 'c',
            description: messages.getMessage('retrieve.workflows.subcommands.flags.client')
        })
    };

    public async run(): Promise<void>
    {
        let username = await UsernameService.calculateFontevaClientUsername(this.flags.client, 'uat');

        return RetrieveHelper.retrieveWorkflows(username);
    }
}
