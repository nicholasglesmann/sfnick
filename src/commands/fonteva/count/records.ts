import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import Stylize from '../../../shared/ui/Stylize';
import FlagMessage from '../../../shared/ui/FlagMessage';
import OutputMessage from '../../../shared/ui/OutputMessage';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfnick', 'fon');

export default class CountRecords extends SfdxCommand
{
    public static description = messages.getMessage('count.records.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: FlagMessage.pathOverride(`${Stylize.success('count')} records from queries`)
        }),
        object: flags.string({
            char: 'o',
            required: false,
            description: FlagMessage.object(`${Stylize.success(`count ${Stylize.bold('ALL')}`)} records for`)
        }),
        query: flags.string({
            char: 'q',
            required: false,
            description: FlagMessage.query(`${Stylize.success('count')} records`)
        })
    };

    public async run(): Promise<any>
    {
        const conn = await OrgService.getConnFromOrg(this.org);

        this._validate();

        let objectQueries = await this._getObjectQueryList(this.flags);

        for (let objectQuery of objectQueries)
        {
            try
            {
                /////// NEW WAY
                await OrgService.queryRecords(objectQuery, conn);

                /////// OLD WAY
                // let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

                // let records = await OrgService.queryRecords(objectQuery, conn);

                // let recordCount = records.length;

                // console.log(`${objectQuery}\n--- ${recordCount} ${objectName} records\n`);
            }
            catch (err)
            {
                cli.action.stop();
                console.error(err.message); // Maybe should throw error here?
            }
        }

        return OutputMessage.endCommand('Count Records');
    }

    private _validate(): void
    {
        if (this.flags.object && this.flags.query)
        {
            throw new Error(`Can't pass an object and a query together!`);
        }
    }

    private async _getObjectQueryList(flags: SfdxCommand["flags"]): Promise<Array<string>>
    {
        let objectQueryList = [];

        if (flags.object) // Query ALL records using passed in object
        {
            let objectQueryOverride = `SELECT Id FROM ${flags.object}`;
            objectQueryList.push(objectQueryOverride);
        }
        else if (flags.query) // Query ALL records using passed in query
        {
            let query = flags.query.replace(' all ', ' id ');

            objectQueryList.push(query);
        }
        else // Use an SFDMU export.json file to get a list of objects/queries
        {
            let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(flags.pathoverride);

            objectQueryList = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);

            objectQueryList.reverse(); // Query records using child objects first
        }

        return objectQueryList;
    }
}
