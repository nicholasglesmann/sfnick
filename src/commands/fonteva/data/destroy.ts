import { SfdxCommand } from '@salesforce/command';
import { Connection, Messages, Org } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { Record } from 'jsforce';
import DataMoverService from '../../../shared/DataMoverService';
import DataMoverHelper from '../../../shared/DataMoverService';
import FilePathService from '../../../shared/FilePathService';
import OrgHelper from './../../../shared/OrgHelper';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DestroyData extends SfdxCommand
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

        await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');

        let sfdxProjectDataMoverPath = await FilePathService.getSfdxProjectDataMoverFolderPath();

        let objectQueriesToDeleteRecords = DataMoverHelper.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);

        objectQueriesToDeleteRecords.reverse();

        for (let objectQuery of objectQueriesToDeleteRecords)
        {
            try
            {
                let records = await OrgHelper.queryRecords(objectQuery, conn);

                if (records.length <= 0)
                {
                    console.log(`No records found for query '${objectQuery}'`);
                    continue;
                }

                console.log(`Destroying ALL records returned from query '${objectQuery}'`);

                let objectName = DataMoverHelper.getObjectNameFromQuery(objectQuery);

                await this._deleteRecords(records, conn, objectName);
            }
            catch (err)
            {
                console.log(err);
            }
        }

        return await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
    }


    // private async _queryRecords(objectName: string, conn: Connection): Promise<Array<Record>>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         let records = [];

    //         conn.query(`SELECT Id FROM ${objectName}`)
    //             .on('record', function(record: any) {
    //                 records.push(<Record> record);
    //             })
    //             .on('end', function() {
    //                 resolve(records);
    //             })
    //             .on('error', function(error: any) {
    //                 reject(error);
    //             })
    //             .run({ autoFetch: true, maxFetch: 50000 });
    //     });
    // }


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
                .destroy(
                    recordIds,
                    async (err, resp) =>
                    {
                        if (err) { reject(err); }

                        await this._deleteChunkOfRecords(records, conn, sObjectName);

                        resolve();
                    }
                );
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
