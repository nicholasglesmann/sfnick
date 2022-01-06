import * as fs from 'fs';
import { QueryResult } from 'jsforce';
import MetadataResult from '../../types/MetadataResult';
import FileSystemService from '../FileSystemService';

export default class PackageService
{
    private getPackageXmlStart(): string
    {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>\n`;
    }


    private getPackageXmlEnd(name, apiVersion): string
    {
        return `\t\t<name>${name}</name>
    </types>
    <version>${apiVersion}</version>
</Package>`;
    }


    private getMembersXmlFromSet(memberSet): Array<string>
    {
        let members = [];

        for (let member of memberSet.values())
        {
            members.push(`\t\t<members>${member}</members>\n`);
        }

        return members;
    }


    private createPackageXmlContent(members, metadataName, apiVersion): string
    {
        let packageXml = [];

        packageXml.push(this.getPackageXmlStart());

        packageXml.push(...this.getMembersXmlFromSet(members));

        packageXml.push(this.getPackageXmlEnd(metadataName, apiVersion));

        return packageXml.join('');
    }


    private writePackageXml(packageXmlContent, metadataType): string
    {
        let packageXmlFilePath = `./temp/${metadataType}Package.xml`;

        fs.writeFileSync(packageXmlFilePath, packageXmlContent);

        console.log(`${metadataType}Package.xml file created!`);

        return packageXmlFilePath;
    }

    public async createPackageXmlFile(results: QueryResult<MetadataResult>, metadataType: string, apiVersion: string): Promise<string>
    {
        let members = this.getMemberSetFromResults(results);

        if (!members.size)
        {
            throw `No ${metadataType}s to retrieve!`;
        }

        let packageXmlContent = this.createPackageXmlContent(members, metadataType, apiVersion);

        await FileSystemService.makeTempDir();

        return this.writePackageXml(packageXmlContent, metadataType);
    }


    private getMemberSetFromResults(results: QueryResult<MetadataResult>): Set<string>
    {
        let members = new Set<string>();

        results.records.forEach(result =>
        {
            if (result.Folder) // Handles Dashboard, Document, EmailTemplate, and Report (Metadata with folders)
            {
                if (!result.Folder.DeveloperName)
                {
                    return;
                }

                let nestedFolders = this._getNestedFolders(result.Folder.DeveloperName);
                nestedFolders.forEach(nestedFolder => members.add(nestedFolder));

                let member = `${result.Folder.DeveloperName}/`;
                member += !! result.NamespacePrefix ? `${result.NamespacePrefix}__${result.DeveloperName}` : result.DeveloperName;

                members.add(member);
            }
            else if (typeof result == 'string')
            {
                members.add(<string> result);
            }
            else // Handle other Metadata Types
            {
                members.add(result.DeveloperName);
            }

        });

        return members;
    }

    private _getNestedFolders(deepestFolder: string): Array<string>
    {
        let allFolders = [];

        let folders = deepestFolder.split('/');
        let folderName = '';

        for (let i = 0; i < folders.length; i++)
        {
            if (i > 0)
            {
                folderName += '/';
            }

            folderName += folders[i];

            allFolders.push(folderName);
        }

        return allFolders;
    }
}
