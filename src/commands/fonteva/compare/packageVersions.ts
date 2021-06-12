import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import { Table } from 'cli-table3';
import InstalledPackage from '../../../types/InstalledPackage';
import OrgService from '../../../shared/OrgService';

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
        let firstOrgConnPromise = OrgService.getConnFrom(this.flags.firstorg);
        let secondOrgConnPromise = OrgService.getConnFrom(this.flags.secondorg);

        const [firstOrgConn, secondOrgConn] = await Promise.all([firstOrgConnPromise, secondOrgConnPromise]);

        let combinedInstalledPackageVersions = await this._getCombinedInstalledPackageVersions(firstOrgConn, secondOrgConn);

        let outputTable = this._constructPackageVersionOutputTable(combinedInstalledPackageVersions);

        this._displayTable(outputTable);
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


    private _displayTable(table: Table): void
    {
        console.log(table.toString());
    }


    private _constructPackageVersionOutputTable(installedPackageVersions: any): Table
    {
        const Table = require('cli-table3');

        let outputTable = new Table({
            head: ['Package Name', 'Package Namespace', 'First Org Verison', 'Second Org Version', 'Matching?'],
            colWidths: [40, 20, 20, 20, 15]
        });

        let packageVersionTableRows = this._createPackageVersionTableRows(installedPackageVersions);

        this._sortNonMatchingPackageVersionsToTop(packageVersionTableRows);

        outputTable.push(...packageVersionTableRows);

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


    private _createPackageVersionTableRows(installedPackageVersions: any): Array<Array<string>>
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
        let doVersionsMatch = this._doVersionsMatch(firstOrgVersion, secondOrgVersion);

        let packageVersionTableRow = [];

        packageVersionTableRow.push(packageName);
        packageVersionTableRow.push(packageNameSpace);
        packageVersionTableRow.push(firstOrgVersion);
        packageVersionTableRow.push(secondOrgVersion);
        packageVersionTableRow.push(doVersionsMatch);

        return packageVersionTableRow;
    }


    private _sortNonMatchingPackageVersionsToTop(packageVersionTableRows: Array<any>)
    {
        const indexOfPackageVersion = 4;

        packageVersionTableRows.sort((a, b) =>
            {
                return (a[indexOfPackageVersion] > b[indexOfPackageVersion])
                ? 1
                : ((b[indexOfPackageVersion] > a[indexOfPackageVersion]) ? -1 : 0);
            }
        );
    }


    private _doVersionsMatch(firstOrgVersion: string, secondOrgVersion: string)
    {
        const colors = require('colors');

        if (firstOrgVersion == secondOrgVersion)
        {
            return colors.green('Yes');
        }

        return colors.red('No');
    }
}
