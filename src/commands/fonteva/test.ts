import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import FilePathService from '../../shared/FilePathService';
import FileSystemService from '../../shared/FileSystemService';
import RegisteredApp from '../../shared/fonteva/RegisteredApp';
import RegisteredObject from '../../shared/fonteva/RegisteredObject';
// import MigrationField from '../../shared/metadata/MigrationField';
// import MigrationFieldCreatorService from '../../shared/metadata/MigrationFieldCreatorService';
// import OrgService from '../../shared/OrgService';
import PromiseService from '../../shared/PromiseService';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class Test extends SfdxCommand
{
    public static description = messages.getMessage('test.description');
    public static examples = [];

    protected static requiresUsername = true;

    // protected static flagsConfig = {
    //     sourceorg: flags.string({
    //         char: 's',
    //         required: true,
    //         description: messages.getMessage('transfer.configData.flags.sourceorg')
    //     }),
    //     targetorg: flags.string({
    //         char: 't',
    //         required: true,
    //         description: messages.getMessage('transfer.configData.flags.targetorg')
    //     }),
    //     pathoverride: flags.string({
    //         char: 'p',
    //         required: false,
    //         description: messages.getMessage('transfer.configData.flags.pathoverride')
    //     }),
    //     productiondomain: flags.string({
    //         char: 'd',
    //         required: false,
    //         description: messages.getMessage('transfer.configData.flags.productiondomain')
    //     })
    // };

    public async run(): Promise<any>
    {
        // let conn = await OrgService.getConnFromUsername(this.flags.targetusername);

        let anonApexFile = FilePathService.getFontevaFrameworkConfigQueryAnonApexFilePath();

        await FileSystemService.makeTempDir();

        let command = `sfdx force:apex:execute -u ${this.flags.targetusername} -f ${anonApexFile} --json`;

        let anonApexJson = await PromiseService.promisifyCommand(command, 'Error getting Framwork Configuration!', false);

        let anonApexResponse = JSON.parse(anonApexJson);

        let frameworkConfigLogLineIdentifier = '|FONTEVA FRAMEWORK CONFIGURATION'; // used to find the anon apex log line that contains the framework JSON

        // console.log(object.result.logs);

        let anonApexLogLines = anonApexResponse.result.logs.split('\n');

        let frameworkConfig;

        anonApexLogLines.forEach(line =>
        {
            if (line.includes(frameworkConfigLogLineIdentifier))
            {
                frameworkConfig = JSON.parse(line.split(frameworkConfigLogLineIdentifier)[1]);

                frameworkConfig.registeredApps.forEach(app => {

                    if (app.name === 'AMT')
                    {
                        let registeredApp = Object.assign(new RegisteredApp, app);

                        if (registeredApp.registeredObjects.length > 0)
                        {
                            let registeredObjects = [];

                            registeredApp.registeredObjects.forEach(registeredObject =>
                            {
                                registeredObjects.push(Object.assign(new RegisteredObject, registeredObject));
                            });

                            registeredApp.registeredObjects = registeredObjects;
                        }

                        console.log(registeredApp);
                    }
                })
            }
        });

        // console.log(JSON.stringify(json, null, 4));







        // conn.tooling.executeAnonymous("System.debug('Check');", function(err, res){
        //     if (err) { return console.error(err); }
        //     console.log(res);
        // });

        // conn.tooling.query("SELECT Id, Application, DurationMilliseconds, Location, LogLength, LogUserId, Operation, Request, RequestIdentifier, StartTime, Status FROM ApexLog", null, function(err, res){
        //     if (err) { return console.error(err); }
        //     console.log(res);
        // });


        // conn.tooling.sobject('ApexLog').find('Select Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog', [])
        // .execute({}, (err, res) =>
        // {
        //     if (err) { console.log(err); }
        //     console.log(res);
        // });







        // let fieldNames = ['Account','Contact'];

        // await MigrationFieldCreatorService.createMigrationFields(conn, fieldNames);

        // let migrationField = new MigrationField('OrderApi__Sales_Order__c');
        // console.log(migrationField.toPlainObject());
    }
}
