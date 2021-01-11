import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import SecretManager from '../../../../shared/SecretManager';
import CONSTANTS from '../../../../shared/constants';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class SetClientSecret extends SfdxCommand
{
    public static description = messages.getMessage('secret.set.clientsecret.description');
    public static examples = [];

    protected static flagsConfig = {
        value: flags.string({
            char: 'v',
            description: messages.getMessage('secret.set.clientsecret.flags.value')
        })
    };

    public async run(): Promise<JsonMap>
    {
        if (!this.flags.value)
        {
            throw new SfdxError('Must pass a client secret! Use -v or --value.')
        }

        let CLIENT_SECRET_KEY = CONSTANTS.FONTEVA_CI_CD_CLIENT_SECRET;

        let secretManager = await SecretManager.init();

        await secretManager.setSecret(CLIENT_SECRET_KEY, this.flags.value);

        console.log('Client secret set!');

        return null;
    }
}
