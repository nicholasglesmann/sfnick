import * as fs from 'fs';
import { QueryResult } from 'jsforce';
import MetadataResult from '../types/MetadataResult';

export default class PackageHelper
{
    private getPackageXmlStart(): string
    {
        return `<?xml version="1.0" encoding="UTF-8"?>
        <Package xmlns="http://soap.sforce.com/2006/04/metadata">
            <types>`;
    }


    private getPackageXmlEnd(name, apiVersion): string
    {
        return `<name>${name}</name>
        </types>
        <version>${apiVersion}</version>
    </Package>`;
    }


    private getMembersXmlFromSet(memberSet): Array<string>
    {
        let members = [];

        for (let member of memberSet.values())
        {
            members.push(`<members>${member}</members>`);
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


    private makeTempDir(): void
    {
        if (!fs.existsSync('./temp'))
        {
            fs.mkdirSync('./temp');
        }
    }


    public createPackageXmlFile(results: QueryResult<MetadataResult>, metadataType: string, apiVersion: string): string
    {
        let members = this.getMemberSetFromResults(results);

        if (!members.size)
        {
            throw `No ${metadataType}s to retrieve!`;
        }

        let packageXmlContent = this.createPackageXmlContent(members, metadataType, apiVersion);

        this.makeTempDir();

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

                members.add(result.Folder.DeveloperName);
                members.add(`${result.Folder.DeveloperName}/${result.DeveloperName}`);
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
}
