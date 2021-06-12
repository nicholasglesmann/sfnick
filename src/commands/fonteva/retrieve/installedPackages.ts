import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import * as fs from 'fs';
import OrgService from '../../../shared/OrgService';
import InstalledPackage from '../../../types/InstalledPackage';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveInstalledPackages extends SfdxCommand
{
    public static description = messages.getMessage('retrieve.installedPackages.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        let installedPackageResults = await OrgService.queryInstalledPackages(conn);

        let installedPackageDirectory = this.createInstalledPackages(installedPackageResults);

        return { installedPackageDirectory };
    }


    private createInstalledPackages(installedPackages: InstalledPackage[]): string
    {
        const installedPackageDirectory = './temp/installedPackages';

        this.createDirectories(installedPackageDirectory);

        console.log(`Creating packages in ${installedPackageDirectory}`);

        installedPackages.forEach((installedPackage: InstalledPackage) =>
        {
            let packageName = installedPackage.getNamespacePrefix();

            if (!packageName) { return; }

            let packageVersion = installedPackage.getPackageVersion();

            let fileName = this.getInstalledPackageXmlFileName(packageName);
            let fileContents = this.getInstalledPackageXmlContent(packageVersion);

            fs.writeFile(`${installedPackageDirectory}/${fileName}`, fileContents, (err) =>
            {
                if(err)
                {
                    throw err;
                }

                console.log(`Created package: ${packageName} v${packageVersion}`);
            });
        });

        return installedPackageDirectory;
    }


    private createDirectories(installedPackageDirectory: string): void
    {
        if (!fs.existsSync('./temp'))
        {
            fs.mkdirSync('./temp');
        }

        if (!fs.existsSync(installedPackageDirectory))
        {
            fs.mkdirSync(installedPackageDirectory);
        }
    }


    private getInstalledPackageXmlFileName(packageName: any): string
    {
        return `${packageName}.installedPackage-meta.xml`;
    }


    private getInstalledPackageXmlContent(packageVersion: any): string
    {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <InstalledPackage xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <activateRSS>true</activateRSS>
                <versionNumber>${packageVersion}</versionNumber>
            </InstalledPackage>`;
    }
}
