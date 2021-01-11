import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import SfdxHelper from '../../../../shared/SfdxHelper';
import CONSTANTS from '../../../../shared/constants';
import GitHelper from '../../../../shared/GitHelper';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class FullOpen extends SfdxCommand
{
    public static description = messages.getMessage('org.full.open.description');
    public static examples = [];

    protected static flagsConfig = {
        client: flags.string({
            char: 'c',
            description: messages.getMessage('org.full.open.flags.client')
        })
    };

    public async run(): Promise<JsonMap>
    {
        let clientName = this.flags.client ? this.flags.client : await GitHelper.getCurrentRepoName();

        if (!clientName)
        {
            throw new SfdxError('This command requires a client name or acronym (use -c or --client)');
        }

        SfdxHelper.forceOrgOpen(`${clientName}-full`, CONSTANTS.ORG_URLS.LIGHTNING_SETUP);

        return null;
    }
}
