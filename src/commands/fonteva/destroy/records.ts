import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, Org } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';
import Stylize from '../../../shared/ui/Stylize';
import OutputMessage from '../../../shared/ui/OutputMessage';
import FlagMessage from '../../../shared/ui/FlagMessage';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DestroyRecords extends SfdxCommand
{
    public static description = messages.getMessage('destroy.records.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: FlagMessage.pathOverride(`${Stylize.danger('destroy')} records from queries`)
        }),
        object: flags.string({
            char: 'o',
            required: false,
            description: FlagMessage.object(`${Stylize.danger(`destroy ${Stylize.bold('ALL')}`)} records for`)
        }),
        query: flags.string({
            char: 'q',
            required: false,
            description: FlagMessage.query(`${Stylize.danger('destroy')} records`)
        }),
        allowprod: flags.boolean({
            char: 'z',
            required: false,
            description: FlagMessage.allowProd(`${Stylize.danger('destroy')} records`)
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: FlagMessage.disableTriggersValidationRules(`${Stylize.danger('destroying')} records`)
        }),
        batchsize: flags.string({
            char: 'b',
            required: false,
            description: FlagMessage.batchSize(`${Stylize.danger('destroying')} records`)
        })
    };

    public async run(): Promise<any>
    {
        const conn = await OrgService.getConnFromOrg(this.org);

        this._validate();

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

                let recordsToDelete = await OrgService.queryRecords(objectQuery, conn);

                let recordsToDeleteCount = recordsToDelete.length;

                if (recordsToDeleteCount <= 0)
                {
                    console.log(`${Stylize.danger('Destroy')} operation ${Stylize.bold('skipped')} because no ${Stylize.fonBlue(objectName)} records were found.\n`);
                    continue;
                }

                let deleteOperator = new OrgDMLOperator(conn, objectName);

                if (this.flags.batchsize)
                {
                    deleteOperator.batchSize = this.flags.batchsize;
                }

                await deleteOperator.run(OperationType.delete, recordsToDelete);

                let recordsRemainingAfterDelete = await OrgService.queryRecords(objectQuery, conn, true);

                if (recordsRemainingAfterDelete.length !== 0)
                {
                    throw new Error(`${Stylize.bold(recordsRemainingAfterDelete.length)} ${Stylize.fonBlue(objectName)} records were ${Stylize.danger('NOT deleted')}!\n`);
                }

                console.log(`All ${Stylize.bold(recordsToDeleteCount)} ${Stylize.fonBlue(objectName)} records were ${Stylize.danger('deleted')}!\n`);
            }
            catch (err)
            {
                cli.action.stop();
                console.error(err.message); // Maybe should throw error here?
            }
        }

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'enable');
        }

        return OutputMessage.endCommand('Destroy Records');
    }


    private _validate(): void
    {
        if (this._isProduction(this.org) && !this.flags.allowprod)
        {
            throw new Error(`Can't run a destroy command in a production org! Use --prod or -z to override.`);
        }

        if (this.flags.object && this.flags.query)
        {
            throw new Error(`Can't pass an object and a query together!`);
        }
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
