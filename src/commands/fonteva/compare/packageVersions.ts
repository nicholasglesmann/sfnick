import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import InstalledPackage from '../../../types/InstalledPackage';
import OrgService from '../../../shared/OrgService';
import OutputTable from '../../../shared/ui/OutputTable';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

enum OrgVersions
{
    FirstOrgVersion,
    SecondOrgVersion
}

export default class ComparePackageVersions extends SfdxCommand
{
    public static description = messages.getMessage('compare.packageVersions.description');
    public static examples = [];

    protected static requiresUsername = false;

    protected static flagsConfig = {
        firstorg: flags.string({
            char: 'f',
            required: true,
            description: messages.getMessage('compare.packageVersions.flags.firstorg')
        }),
        secondorg: flags.string({
            char: 's',
            required: true,
            description: messages.getMessage('compare.packageVersions.flags.secondorg')
        })
    };

    public async run(): Promise<void>
    {
        let firstOrgConnPromise = OrgService.getConnFromUsername(this.flags.firstorg);
        let secondOrgConnPromise = OrgService.getConnFromUsername(this.flags.secondorg);

        const [firstOrgConn, secondOrgConn] = await Promise.all([firstOrgConnPromise, secondOrgConnPromise]);

        let combinedInstalledPackageVersions = await this._getCombinedInstalledPackageVersions(firstOrgConn, secondOrgConn);

        let outputTable = this._constructPackageVersionOutputTable(combinedInstalledPackageVersions);
        outputTable.render();
    }


    private async _getCombinedInstalledPackageVersions(firstOrgConn: Connection, secondOrgConn: Connection): Promise<any>
    {
        let firstOrgPackageQueryPromise = OrgService.queryInstalledPackages(firstOrgConn);
        let secondOrgPackageQueryPromise = OrgService.queryInstalledPackages(secondOrgConn);

        let [firstOrgInstalledPackages, secondOrgInstalledPackages] = await Promise.all([firstOrgPackageQueryPromise, secondOrgPackageQueryPromise]);

        let combinedInstalledPackageVersions = {};

        this._combineInstalledPackageVersions(firstOrgInstalledPackages, combinedInstalledPackageVersions, OrgVersions.FirstOrgVersion);
        this._combineInstalledPackageVersions(secondOrgInstalledPackages, combinedInstalledPackageVersions, OrgVersions.SecondOrgVersion);

        return combinedInstalledPackageVersions;
    }

    private _constructPackageVersionOutputTable(installedPackageVersions: any): OutputTable
    {
        let outputTable = new OutputTable();
        outputTable.setTableHead(['Package Name', 'Package Namespace', 'First Org Verison', 'Second Org Version', 'Matching?']);
        outputTable.setColumnWidths([40, 20, 20, 20, 15]);

        let packageVersionTableRows = this._createPackageVersionTableRows(installedPackageVersions);
        outputTable.addRows(packageVersionTableRows);
        outputTable.sortNonMatchingRowsToTop({ indexOfColumnToSortOn: 4 });

        return outputTable;
    }

    private _combineInstalledPackageVersions(orgInstalledPackages: InstalledPackage[], combinedInstalledPackageVersions: any, whichOrg: OrgVersions)
    {
        orgInstalledPackages.forEach(installedPackage =>
        {
            let packageNameSpace = installedPackage.getNamespacePrefix();

            if (!combinedInstalledPackageVersions[packageNameSpace])
            {
                combinedInstalledPackageVersions[packageNameSpace] = {};
                combinedInstalledPackageVersions[packageNameSpace].Name = installedPackage.getName();
            }

            combinedInstalledPackageVersions[packageNameSpace][whichOrg] = installedPackage.getPackageVersion();
        });
    }

    private _createPackageVersionTableRows(installedPackageVersions: any): string[][]
    {
        let packageVersionTableRows = [];

        for (let packageNameSpace in installedPackageVersions)
        {
            let installedPackage = installedPackageVersions[packageNameSpace];

            let packageVersionTableRow = this._createPackageVersionTableRow(packageNameSpace, installedPackage);

            packageVersionTableRows.push(packageVersionTableRow);
        }

        return packageVersionTableRows;
    }

    private _createPackageVersionTableRow(packageNameSpace: string, installedPackage: any): Array<string>
    {
        let packageName = installedPackage.Name;
        let firstOrgVersion = installedPackage[OrgVersions.FirstOrgVersion];
        let secondOrgVersion = installedPackage[OrgVersions.SecondOrgVersion];
        let doVersionsMatch = OutputTable.isMatch(firstOrgVersion, secondOrgVersion);

        let packageVersionTableRow = [];

        packageVersionTableRow.push(packageName);
        packageVersionTableRow.push(packageNameSpace);
        packageVersionTableRow.push(firstOrgVersion);
        packageVersionTableRow.push(secondOrgVersion);
        packageVersionTableRow.push(doVersionsMatch);

        return packageVersionTableRow;
    }
}
