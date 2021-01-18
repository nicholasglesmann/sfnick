import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { exec, ExecException, ExecOptions } from 'child_process';
import * as util from 'util';
import SecretManager from '../../shared/SecretManager';
import CONSTANTS from '../../shared/constants';

// import { AuthWebLoginCommand } from '@salesforce/command';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class UatConnect extends SfdxCommand
{
    public static description = messages.getMessage('connect.description');
    public static examples = [];

    protected static flagsConfig = {
        client: flags.string({
            char: 'c',
            description: messages.getMessage('connect.subcommands.flags.client')
        })
    };

    public execute(command: string, options: ExecOptions, callback: (error: ExecException | null, stdout: string, stderr: string) => void): Promise<any>
    {
        return util.promisify(exec)(command, options);
    }

    public async run(): Promise<JsonMap>
    {

        throw new SfdxError('Command not implemented yet....check back soon!');



        let CLIENT_ID_KEY = CONSTANTS.FONTEVA_CI_CD_CLIENT_ID;
        let CLIENT_SECRET_KEY = CONSTANTS.FONTEVA_CI_CD_CLIENT_SECRET;

        let secretManager = await SecretManager.init();

        let clientId = await secretManager.getSecret(CLIENT_ID_KEY);
        let clientSecret = await secretManager.getSecret(CLIENT_SECRET_KEY);

        if (!clientId)
        {
            throw new SfdxError(`No client Id is set! Use command: sfdx fonteva:secret:set:clientid -v {CLIENT_ID}`);
        }

        if (!clientSecret)
        {
            throw new SfdxError(`No client secret is set! Use command: sfdx fonteva:secret:set:clientsecret -v {CLIENT_SECRET}`);
        }

        let clientName = this.flags.client;

        if (!clientName)
        {
            throw new SfdxError('This command requires a client name or acronym (use -c or --client)');
        }

        let authCommand = `sfdx force:auth:web:login -i "${clientId}" --setdefaultusername --setalias "${clientName}-uat"`;

        let cmd = await exec(authCommand, <ExecOptions>{ stdio: 'ignore' },
            (error: ExecException, stdout: string, stderr: string) =>
            {
                console.log(process.env.TERM);
                console.log(process.stdin.isTTY);

                if (error)
                {
                    console.log(error);
                }

                if (stderr)
                {
                    console.log(stderr);
                }
            }
        );

        cmd.stdin.write(clientSecret);

        console.log(`Client ${clientName} is successfully connected! Use the alias '${clientName}-uat' for any future SFDX or Fonteva CLI commands.`);

        return null;
    }
}
