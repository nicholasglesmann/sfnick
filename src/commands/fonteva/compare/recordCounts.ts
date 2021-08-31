import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import OutputTable from '../../../shared/ui/OutputTable';
import Stylize from '../../../shared/ui/Stylize';
import FlagMessage from '../../../shared/ui/FlagMessage';
import OutputMessage from '../../../shared/ui/OutputMessage';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class CompareRecordCounts extends SfdxCommand
{
    public static description = messages.getMessage('compare.recordCounts.description');
    public static examples = [];

    protected static flagsConfig = {
        firstorg: flags.string({
            char: 's',
            required: true,
            description: FlagMessage.firstOrg(`${Stylize.info('compare')} record counts`)
        }),
        secondorg: flags.string({
            char: 't',
            required: true,
            description: FlagMessage.secondOrg(`${Stylize.info('compare')} record counts`)
        }),
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: FlagMessage.pathOverride(`${Stylize.info('compare')} record counts from queries`)
        }),
        productiondomain: flags.string({
            char: 'd',
            required: false,
            description: messages.getMessage('transfer.configData.flags.productiondomain')
        })
    };

    public async run(): Promise<any>
    {
        let firstOrgConnPromise = OrgService.getConnFromUsername(this.flags.firstorg);
        let secondOrgConnPromise = OrgService.getConnFromUsername(this.flags.secondorg);

        const [firstOrgConn, secondOrgConn] = await Promise.all([firstOrgConnPromise, secondOrgConnPromise]);

        let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(this.flags.pathoverride);

        let objectQueryList = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);

        cli.action.start(`Gathering record counts for ${objectQueryList.length} objects`);

        let recordCountRows = await this._buildRecordCountRows(objectQueryList, firstOrgConn, secondOrgConn);

        cli.action.stop(`Done!`);

        let outputTable = this._constructRecordCountOutputTable(recordCountRows);
        outputTable.render();

        return OutputMessage.endCommand();
    }

    private async _buildRecordCountRows(objectQueryList: string[], firstOrgConn: Connection, secondOrgConn: Connection): Promise<string[][]>
    {
        let recordCountRows = [];

        for (let objectQuery of objectQueryList)
        {
            try
            {
                let recordCountRow = await this._buildRecordCountRow(objectQuery, firstOrgConn, secondOrgConn);

                recordCountRows.push(recordCountRow);
            }
            catch (err)
            {
                console.error(err.message); // Maybe should throw error here?
            }
        }

        return recordCountRows;
    }

    private async _buildRecordCountRow(objectQuery: string, firstOrgConn: Connection, secondOrgConn: Connection): Promise<string[]>
    {
        let recordCountRow = [];

        let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

        recordCountRow.push(objectName);

        let sourceRecords = await OrgService.queryRecords(objectQuery, firstOrgConn, true);
        let sourceRecordCount = sourceRecords.length;
        recordCountRow.push(sourceRecordCount);

        let targetRecords = await OrgService.queryRecords(objectQuery, secondOrgConn, true);
        let targetRecordCount = targetRecords.length;
        recordCountRow.push(targetRecordCount);

        let isCountEqual = OutputTable.isMatch(sourceRecordCount, targetRecordCount);
        recordCountRow.push(isCountEqual);

        return recordCountRow;
    }

    private _constructRecordCountOutputTable(recordCountRows: string[][]): OutputTable
    {
        let outputTable = new OutputTable();
        outputTable.setTableHead(['Object Name', 'Source Count', 'Target Count', 'Equal?']);
        outputTable.setColumnWidths([45, 15, 15, 10]);
        outputTable.addRows(recordCountRows);
        outputTable.sortNonMatchingRowsToTop({ indexOfColumnToSortOn: 3 });

        return outputTable;
    }

    // private _contructApexTestDataMoverFactory(recordCountsByObjectName: any): string
    // {
    //     let dataMoverTestFactory = 'Map<String,Integer> getCreatedRecordCounts()\n';
    //     dataMoverTestFactory += '{\n';
    //     dataMoverTestFactory += '    return new Map<String, Integer>{\n';

    //     let objectNames = Object.keys(recordCountsByObjectName);

    //     for (let i = 0; i < objectNames.length; i++)
    //     {
    //         dataMoverTestFactory += '       \'' + objectNames[i] + '\' => ' + recordCountsByObjectName[objectNames[i]];
    //         dataMoverTestFactory += (i == objectNames.length - 1) ? '\n' : ',\n';
    //     }

    //     dataMoverTestFactory += '    };\n';
    //     dataMoverTestFactory += '}\n\n';



    //     dataMoverTestFactory += 'Map<String,Integer> getDeletedRecordCounts()\n';
    //     dataMoverTestFactory += '{\n';
    //     dataMoverTestFactory += '    return new Map<String, Integer>{\n';

    //     for (let i = 0; i < objectNames.length; i++)
    //     {
    //         dataMoverTestFactory += '       \'' + objectNames[i] + '\' => ' + '0';

    //         dataMoverTestFactory += (i == objectNames.length - 1) ? '\n' : ',\n';
    //     }

    //     dataMoverTestFactory += '    };\n';
    //     dataMoverTestFactory += '}\n';

    //     return dataMoverTestFactory;
    // }
}

