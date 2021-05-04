import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages, Org } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { Record } from 'jsforce';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'

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

    protected static flagsConfig = {
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: messages.getMessage('data.destroy.flags.pathoverride')
        }),
        object: flags.string({
            char: 'o',
            required: false,
            description: messages.getMessage('data.destroy.flags.object')
        }),
        query: flags.string({
            char: 'q',
            required: false,
            description: messages.getMessage('data.destroy.flags.query')
        }),
        prod: flags.boolean({
            char: 'z',
            required: false,
            description: messages.getMessage('data.destroy.flags.prod')
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: messages.getMessage('data.destroy.flags.disabletriggersvalidationrules')
        })
    };

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        if (this._isProduction(org) && !this.flags.prod)
        {
            console.error(`Can't run a destroy command in a production org! Use --prod or -z to override.`);
            return null;
        }

        if (this.flags.object && this.flags.query)
        {
            console.error(`Can't pass an object and a query together!`);
            return null;
        }

        let objectQueriesToDeleteRecords = [];

        if (this.flags.object) // Delete ALL records from this object
        {
            let objectQueryOverride = `SELECT Id FROM ${this.flags.object}`;
            objectQueriesToDeleteRecords.push(objectQueryOverride);
        }
        else if (this.flags.query)
        {
            objectQueriesToDeleteRecords.push(this.flags.query);
        }
        else // Use an SFDMU export.json file to get a list of objects
        {
            let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(this.flags.pathoverride);

            objectQueriesToDeleteRecords = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);

            objectQueriesToDeleteRecords.reverse(); // Delete records from child objects first
        }

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        }

        for (let objectQuery of objectQueriesToDeleteRecords)
        {
            try
            {
                let recordsToDelete = await OrgService.queryRecords(objectQuery, conn);

                let recordsToDeleteCount = recordsToDelete.length;

                if (recordsToDeleteCount <= 0)
                {
                    console.log(`No records found for query '${objectQuery}'`);
                    continue;
                }

                console.log(`Destroying ALL ${recordsToDeleteCount} records returned from query "${objectQuery}"`);

                let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

                cli.action.start('Deleting records');

                await this._deleteRecords(recordsToDelete, conn, objectName);

                let recordsRemainingAfterDelete = await OrgService.queryRecords(objectQuery, conn);

                if (recordsRemainingAfterDelete.length !== 0)
                {
                    throw new Error(`${recordsRemainingAfterDelete.length} ${objectName} records were NOT deleted!`);
                }
                else
                {
                    cli.action.stop(`${recordsToDeleteCount} ${objectName} records deleted!`);
                }
            }
            catch (err)
            {
                cli.action.stop();
                console.error(err);
            }
        }

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'enable');
        }

        console.log('Destroy operation completed!');

        return null;
    }

    private async _deleteRecords(records: Array<Record>, conn: Connection, sObjectName: string): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            let deletePromises = [];

            try
            {
                while (records.length > 0)
                {
                    let chunkOfRecords = this._removeChunkOfRecordsFromArray(records);

                    deletePromises.push(this._deleteChunkOfRecords(chunkOfRecords, conn, sObjectName));
                }

                await Promise.all(deletePromises);

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
            conn.sobject(sObjectName)
                .destroy(
                    records,
                    async (err, resp) =>
                    {
                        if (err) { reject(err); }

                        resolve();
                    }
                );
        });
    }


    private _removeChunkOfRecordsFromArray(records: Array<Record>): Array<string>
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
