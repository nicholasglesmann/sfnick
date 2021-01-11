import { SfdxCommand } from '@salesforce/command';
import { Connection, Messages, Org } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { Record } from 'jsforce';
// import * as fs from 'fs';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DataDestroy extends SfdxCommand
{
    public static description = messages.getMessage('data.destroy.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        if (this._isProduction(org))
        {
            console.error(`Can't run a destroy command on a production org!`);
            return null;
        }

        // let objectsToDeleteRecords = ['Account', 'Contact'];
        let objectsToDeleteRecords = ['OrderApi__Business_Group__c', 'OrderApi__GL_Account__c', 'OrderApi__Payment_Gateway__c', 'OrderApi__Store__c', 'OrderApi__Item__c', 'OrderApi__Item_Class__c', 'PriceApi__Bulk_Price_Rule__c', 'OrderApi__Price_Rule__c', 'OrderApi__Price_Rule_Variable__c', 'OrderApi__Item_Subscription_Plan__c', 'OrderApi__Package_Item__c', 'OrderApi__Badge_Type__c', 'OrderApi__Badge_Workflow__c', 'OrderApi__Tax_Locale__c', 'OrderApi__Subscription_Plan__c', 'EventApi__Event_Status_Page__c', 'EventApi__Event_Status__c', 'EventApi__Event_Page_Component__c', 'EventApi__Event_Page__c', 'EventApi__Ticket_Type__c', 'EventApi__Event__c', 'PagesApi__Theme__c', 'PagesApi__Community_Group__c', 'DRCTS__Directories__c', 'PagesApi__Form__c', 'PagesApi__Field_Group__c', 'PagesApi__Field__c', 'OrderApi__Catalog__c', 'OrderApi__Catalog_Item__c', 'OrderApi__Shipping_Method__c', 'OrderApi__Shipping_Region__c', 'OrderApi__Source_Code__c', 'joinapi__Join_Process__c', 'joinapi__Step__c', 'joinapi__Step_Condition__c', 'PagesApi__Media_Asset_Collection__c', 'PagesApi__Media_Asset__c', 'PagesApi__Menu__c', 'PagesApi__Menu_Item__c'];

        for (let objectName of objectsToDeleteRecords)
        {
            try
            {
                let records = await this._queryRecords(objectName, conn);

                if (records.length <= 0)
                {
                    console.log(`No records found of type ${objectName}`);
                    continue;
                }

                console.log(`Destroying ALL records of type ${objectName}`);
                await this._deleteRecords(records, conn, objectName);
            }
            catch (err)
            {
                console.log(err);
            }
        }

        return null;
    }

    private async _queryRecords(objectName: string, conn: Connection): Promise<Array<Record>>
    {
        return new Promise((resolve, reject) =>
        {
            let records = [];

            conn.query(`SELECT Id FROM ${objectName}`)
                .on('record', function(record: any) {
                    records.push(<Record> record);
                })
                .on('end', function() {
                    resolve(records);
                })
                .on('error', function(error: any) {
                    reject(error);
                })
                .run({ autoFetch: true, maxFetch: 50000 });
        });
    }


    private async _deleteRecords(records: Array<Record>, conn: Connection, sObjectName: string): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                await this._deleteChunkOfRecords(records, conn, sObjectName);
                console.log(`Done deleting ${sObjectName}`);
                resolve();
            }
            catch (err)
            {
                console.log(err);
                reject(err);
            }
        });
    }


    private async _deleteChunkOfRecords(records: Array<Record>, conn: Connection, sObjectName: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            console.log(`${sObjectName} remaining: ${records.length}`);

            if (records.length <= 0)
            {
                resolve();
                return;
            }

            let recordIds = this._getRecordIds(records);

            conn.sobject(sObjectName)
                .destroy(recordIds, async (err, resp) =>
                {
                    if (err) { reject(err); }

                    await this._deleteChunkOfRecords(records, conn, sObjectName);

                    resolve();
                });
        });
    }


    private _getRecordIds(records: Array<Record>): Array<string>
    {
        return records.splice(0, 200)
                    .map(record => record.Id);
    }


    private _isProduction(org: Org): boolean
    {
        let isOrgProduction = false;

        let orgOptions = org.getField(<any>'options');

        if (!orgOptions)
        {
            console.log(`Can't validate that org is safe to delete data....continuing destroy operation`);
            return isOrgProduction;
        }

        let orgAlias = orgOptions['aliasOrUsername'];

        if (orgAlias.includes('prod') || orgAlias.includes('production'))
        {
            isOrgProduction = true;
        }

        return isOrgProduction;
    }
}
