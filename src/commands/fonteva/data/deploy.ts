import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
// import OrgService from '../../../shared/OrgService';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DataDeploy extends SfdxCommand
{
    public static description = messages.getMessage('data.deploy.description');
    public static examples = [];

    protected static requiresUsername = false;

    protected static flagsConfig = {
        sourceorg: flags.string({
            char: 's',
            required: true,
            description: messages.getMessage('transfer.configData.flags.sourceorg')
        }),
        targetorg: flags.string({
            char: 't',
            required: true,
            description: messages.getMessage('transfer.configData.flags.targetorg')
        }),
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: messages.getMessage('transfer.configData.flags.pathoverride')
        })
    };


    public async run(): Promise<void>
    {
        return DataMoverService.reassignSalesforceIdReferences(this.flags.sourceorg, this.flags.targetorg);
    }
}
