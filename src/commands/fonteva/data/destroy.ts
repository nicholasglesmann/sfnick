import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, Org } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import { OrgCrudOperator, OperationType } from '../../../shared/OrgCrudOperator';
import { performance } from 'perf_hooks';


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
        allowprod: flags.boolean({
            char: 'z',
            required: false,
            description: messages.getMessage('data.destroy.flags.allowprod')
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

        if (this._isProduction(org) && !this.flags.allowprod)
        {
            console.error(`Can't run a destroy command in a production org! Use --prod or -z to override.`);
            return null;
        }

        if (this.flags.object && this.flags.query)
        {
            console.error(`Can't pass an object and a query together!`);
            return null;
        }

        let objectQueriesToDeleteRecords = await this._getObjectDeleteQueryList(this.flags);

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        }

        for (let objectQuery of objectQueriesToDeleteRecords)
        {
            try
            {
                let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

                cli.action.start(`Querying for ${objectName} records using query "${objectQuery}"`);

                let queryStartTime = performance.now();

                let recordsToDelete = await OrgService.queryRecords(objectQuery, conn);

                let recordsToDeleteCount = recordsToDelete.length;

                let queryEndTime = performance.now();
                let queryTotalTime = Math.floor((queryEndTime - queryStartTime) / 1000);

                cli.action.stop(`${recordsToDeleteCount} ${objectName} records found in ${queryTotalTime} seconds!`);

                if (recordsToDeleteCount <= 0)
                {
                    console.log(`No records found for query '${objectQuery}'`);
                    continue;
                }

                cli.action.start(`Destroying ALL ${recordsToDeleteCount} records returned from query "${objectQuery}"`);

                let deleteStartTime = performance.now();

                let deleteOperator = new OrgCrudOperator(conn, objectName);
                await deleteOperator.run(OperationType.Delete, recordsToDelete);

                let deleteEndTime = performance.now();
                let deleteTotalTime = Math.floor((deleteEndTime - deleteStartTime) / 1000);

                console.log(`Delete operation finished in ${deleteTotalTime} seconds!`);

                let recordsRemainingAfterDelete = await OrgService.queryRecords(objectQuery, conn);

                if (recordsRemainingAfterDelete.length !== 0)
                {
                    throw new Error(`${recordsRemainingAfterDelete.length} ${objectName} records were NOT deleted!`);
                }

                cli.action.stop(`all ${recordsToDeleteCount} ${objectName} records were deleted!`);
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

    private async _getObjectDeleteQueryList(flags: SfdxCommand["flags"]): Promise<Array<string>>
    {
        let objectDeleteQueryList = [];

        if (flags.object) // Delete ALL records from passed in object
        {
            let objectQueryOverride = `SELECT Id FROM ${flags.object}`;
            objectDeleteQueryList.push(objectQueryOverride);
        }
        else if (flags.query) // Delete ALL records from passed in query
        {
            objectDeleteQueryList.push(flags.query);
        }
        else // Use an SFDMU export.json file to get a list of objects/queries
        {
            let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(flags.pathoverride);

            objectDeleteQueryList = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);

            objectDeleteQueryList.reverse(); // Delete records from child objects first
        }

        return objectDeleteQueryList;
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
