import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
// import OrgHelper from '../../../shared/OrgService';
import DataMoverService from '../../../shared/DataMoverService';
// import { OperationType, OrgDMLOperator } from '../../../shared/OrgDMLOperator';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class FixField extends SfdxCommand
{
    public static description = messages.getMessage('fix.field.description');
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
    public async run(): Promise<any>
    {
        return DataMoverService.repairFieldRecords(this.flags.sourceorg, this.flags.targetorg);








        // const org = this.org;
        // const conn = org.getConnection();
        // await org.refreshAuth();

        // // APNA VERSION
        // // let objectQuery = 'SELECT Id, Account.Legacy_Account_ID__c, Contact.Legacy_Member_ID__c, Legacy_Relationship_Id__c FROM AccountContactRelation WHERE Account.Legacy_Account_ID__c != null AND Contact.Legacy_Member_ID__c != null';

        // // ASA VERSION
        // let objectQuery = 'SELECT Id, Legacy_Account_ID__c, Legacy_Contact_ID__c, Legacy_Relationship_Id__c FROM AccountContactRelation WHERE Legacy_Account_ID__c != null AND Legacy_Contact_ID__c != null';

        // try
        // {
        //     let records = await OrgHelper.queryRecords(objectQuery, conn);

        //     if (records.length <= 0)
        //     {
        //         console.log(`No records found for query '${objectQuery}'`);
        //         return null;
        //     }

        //     // // APNA VERSION
        //     // //////////////
        //     // records.forEach(record =>
        //     // {
        //     //     record.Legacy_Relationship_Id__c = `${record.Account.Legacy_Account_Id__c}:${record.Contact.Legacy_Member_ID__c}`;
        //     //     // record.Legacy_Relationship_Id__c = '';
        //     //     delete record.Account; // Needed to prevent update errors since this is a formula field
        //     //     delete record.Contact; // Needed to prevent update errors since this is a formula field
        //     // });
        //     // //////////////

        //     // ASA VERSION
        //     //////////// PROCESSING UNIQUE TO THIS OPERATION (could be callback)
        //     records.forEach(record =>
        //     {
        //         record.Legacy_Relationship_Id__c = `${record.Legacy_Account_ID__c}:${record.Legacy_Contact_ID__c}`;
        //         // record.Legacy_Relationship_Id__c = '';
        //         delete record.Legacy_Account_ID__c; // Needed to prevent update errors since this is a formula field
        //         delete record.Legacy_Contact_ID__c; // Needed to prevent update errors since this is a formula field
        //     });
        //     ////////////////////////////////////////////////////////////////////

        //     console.log(`Updating ALL records returned from query '${objectQuery}'`); // Slightly different for various CRUD operations

        //     let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

        //     let orgCrudOperator = new OrgDMLOperator(conn, objectName);
        //     await orgCrudOperator.run(OperationType.Update, records);
        // }
        // catch (err)
        // {
        //     console.log(err);
        // }

        // return null;
    }

    // private async _updateRecords(records: Array<Record>, conn: Connection, sObjectName: string): Promise<void>
    // {
    //     return new Promise(async (resolve, reject) =>
    //     {
    //         let updatePromises = [];  // Abstract into new function

    //         console.log(`${records.length} ${sObjectName} records being updated...`); // Slightly different for various CRUD operations

    //         try  // Abstract into new function
    //         {
    //             while (records.length > 0)  // Abstract into new function
    //             {
    //                 let chunkOfRecords = this._removeChunkOfRecordsFromArray(records); // Abstract into new function

    //                 updatePromises.push(this._updateChunkOfRecords(chunkOfRecords, conn, sObjectName)); // Slightly different for various CRUD operations
    //             }

    //             await Promise.all(updatePromises);  // Abstract into new function

    //             console.log(`Done updating ${sObjectName}`);  // Abstract into new function
    //             resolve();  // Abstract into new function
    //         }
    //         catch (err)  // Abstract into new function
    //         {
    //             console.log(err);  // Abstract into new function
    //             reject(err);  // Abstract into new function
    //         }
    //     });
    // }

    // private async _updateChunkOfRecords(records: Array<Record>, conn: Connection, sObjectName: string): Promise<void>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         conn.sobject(sObjectName)
    //             .update( // Only part that varies
    //                 records,
    //                 async (err, resp) =>
    //                 {
    //                     if (err) { reject(err); }

    //                     resolve();
    //                 }
    //             );
    //     });
    // }

    // private _removeChunkOfRecordsFromArray(records: Array<Record>): Array<string>
    // {
    //     return records.splice(0, 200);
    // }

}
