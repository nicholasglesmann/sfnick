import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import FilePathService from '../../../shared/FilePathService';
import FileSystemService from '../../../shared/FileSystemService';
import PromiseService from '../../../shared/PromiseService';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class TransferSparkAdmin extends SfdxCommand
{
    public static description = messages.getMessage('transfer.configData.description');
    public static examples = [];

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
        }),
        productiondomain: flags.string({
            char: 'd',
            required: false,
            description: messages.getMessage('transfer.configData.flags.productiondomain')
        })
    };

    public async run(): Promise<any>
    {

        let frameworkConfig = await this._getSparkAdminConfig();

        let registeredAppsToTransfer = [];

        frameworkConfig.registeredApps.forEach(app =>
        {
            if (app.name === 'IMTS') // Currently hardcoded to only accept one app, should be modified to IGNORE managed apps
            {
                registeredAppsToTransfer.push(`${JSON.stringify(app)}`);
            }
        });

        let searchRegExp = new RegExp("'",'g');

        registeredAppsToTransfer.forEach(async registeredApp =>
        {
            let sendSparkConfigAnonApex = `string app = '${registeredApp.replace(searchRegExp,"\\'")}';
            Framework.RegisteredApp a = (Framework.RegisteredApp) JSON.deserializeStrict(app, Framework.RegisteredApp.class);
            Framework.Config.push(a);
            Framework.Config.push(a.registeredObjects);
            Framework.Config.push(a.rollupSummaryFields);
            Framework.Config.push(a.routingRules);`;

            FileSystemService.makeTempDir();

            let filePath = await FileSystemService.writeAnonApexFile(sendSparkConfigAnonApex, 'sparkAdminAnonApex');

            let uploadCommand = `sfdx force:apex:execute -u ${this.flags.targetorg} -f ${filePath}`;

            let output = await PromiseService.promisifyCommand(uploadCommand, 'Error uploading Fonteva Framework Configuration!', false);

            console.log(output);
            console.log(uploadCommand);
        });
    }

    private async _getSparkAdminConfig(): Promise<any>
    {
        let sparkAdminAnonApexResultObject = await this._querySparkAdminConfig();

        return this._parseSparkAdminQueryJSON(sparkAdminAnonApexResultObject);
    }


    private async _querySparkAdminConfig(): Promise<any>
    {
        let getSparkConfigAanonApexFile = FilePathService.getFontevaFrameworkConfigQueryAnonApexFilePath();

        let command = `sfdx force:apex:execute -u ${this.flags.sourceorg} -f ${getSparkConfigAanonApexFile} --json`;

        let anonApexJson = await PromiseService.promisifyCommand(command, 'Error getting Framwork Configuration!', false);

        return JSON.parse(anonApexJson);
    }


    private _parseSparkAdminQueryJSON(queryLog: any): Promise<any>
    {
        let frameworkConfigLogLineIdentifier = '|FONTEVA FRAMEWORK CONFIGURATION'; // used to find the anon apex log line that contains the framework JSON

        let anonApexLogLines = queryLog.result.logs.split('\n');

        let frameworkConfig;

        anonApexLogLines.forEach(line =>
        {
            if (line.includes(frameworkConfigLogLineIdentifier))
            {
                frameworkConfig = JSON.parse(line.split(frameworkConfigLogLineIdentifier)[1]);
            }
        });

        return frameworkConfig;
    }
}
