import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
import MigrationFieldCreatorService from '../../../shared/metadata/MigrationFieldCreatorService';
import OrgService from '../../../shared/OrgService';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class TransferConfigData extends SfdxCommand
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
        let sourceOrgConn = await OrgService.getConnFromUsername(this.flags.sourceorg);
        let targetOrgConn = await OrgService.getConnFromUsername(this.flags.targetorg);

        // - Read the SFDMU export.json configuration file to get a list of object names for objects that will be moved
        let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(this.flags.pathoverride);

        let objectNamesList = DataMoverService.getobjectNameListFromExportFile(sfdxProjectDataMoverPath);

        let metadataUpsertJobPromises = [];
        // - For each object:
        //    - Check for the Migration Id field on the query's object in the SOURCE org
        //       - If the Migration Id field does not exist, create it
        metadataUpsertJobPromises.push(MigrationFieldCreatorService.createMigrationFields(sourceOrgConn, objectNamesList));

        //    - Check for the Migration Id field on the query's object in the TARGET org
        //       - If the Migration Id field does not exist, create it
        metadataUpsertJobPromises.push(MigrationFieldCreatorService.createMigrationFields(targetOrgConn, objectNamesList));

        await Promise.all(metadataUpsertJobPromises);


        //return DataMoverService.transfer(this.flags.sourceorg, this.flags.targetorg, this.flags.pathoverride, this.flags.productiondomain);

        // - Scan current Fonteva triggers/validation settings in the SOURCE org and store them locally in a temp file
        // - Scan current Fonteva triggers/validation settings in the TARGET org and store them locally in a temp file
        // - Disable all Fonteva triggers/validation in the SOURCE org
        // - Disable all Fonteva triggers/validation in the TARGET org

        // - Read the SFDMU export.json configuration file to get a list of queries for objects/records that will be moved

        // - For each query:

        //    - Query the SF Id and Migration Id for all records that need to be moved in the SOURCE org

        //    - For each record:
        //       - Check if there is a value in the Migration Id
        //          - If not, copy the SF Id to the Migration Id (plus some concatenation)

        //    - Update the records in the SOURCE org

        // - Run the SFDMU command to move the config data from the SOURCE org to the TARGET org
        //    - Use an UPSERT operation with Migration Id as the external Id

        // - Run the Fonteva field fixes to repair Price Rules, Price Rule Variables, and Skip Logic Rules (and any other objects that have fields that use hard-coded SF IDs in strings) in the TARGET org

        // - Loop through the SFDMU export.json queries again and for each query:
        //    - Get the record count in the SOURCE org
        //    - Get the record count in the TARGET org

        // - Print a chart to the console showing record counts in the SOURCE org and the TARGET org to check if they match. List non-matching objects first.

        // - Restore Fonteva triggers/validation to pre-migration state in SOURCE org using the locally stored settings
        // - Restore Fonteva triggers/validation to pre-migration state in TARGET org using the locally stored settings
    }
}
