import PromiseHelper from "./PromiseHelper";
import * as fs from 'fs';
import { SfdxError } from "@salesforce/core";
import PathHelper from './PathHelper';
import FileSystemHelper from './FileSystemHelper';
import CONSTANTS from './constants';
import DataMoverExportFile from "../types/DataMoverExportFile";

export default class DataMoverHelper
{
    static async createSfdxProjectDataMoverFolder(): Promise<string>
    {
        let sfdxProjectDataMoverPath = await PathHelper.getSfdxProjectDataMoverFolderPath();

        if (!fs.existsSync(sfdxProjectDataMoverPath))
        {
            console.log(`Creating folder ${sfdxProjectDataMoverPath}...`);
            fs.mkdirSync(sfdxProjectDataMoverPath);
        }

        return sfdxProjectDataMoverPath;
    }

    static async retrieve(username: string): Promise<any>
    {
        let sfdxProjectDataMoverPath = await DataMoverHelper.setUpFiles();

        let sfdxCommand = `sfdx sfdmu:run --sourceusername ${username} --targetusername csvfile --path "${sfdxProjectDataMoverPath}"`;

        return PromiseHelper.promisifyCommand(sfdxCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);
    }

    static async deploy(username: string): Promise<any>
    {
        let sfdxProjectDataMoverPath = await PathHelper.getSfdxProjectDataMoverFolderPath();

        let sfdxCommand = `sfdx sfdmu:run --sourceusername csvfile --targetusername ${username} --path "${sfdxProjectDataMoverPath}"`;

        return PromiseHelper.promisifyCommand(sfdxCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);
    }

    static async setUpFiles(): Promise<string>
    {
        let sfdxProjectDataMoverPath = await DataMoverHelper.createSfdxProjectDataMoverFolder();

        if (!DataMoverHelper.doesExportFileExist(sfdxProjectDataMoverPath))
        {
            DataMoverHelper.copyDefaultExportFileTo(sfdxProjectDataMoverPath);
        }
        else
        {
            console.log(`Using existing ${CONSTANTS.DATA_MOVER_EXPORT_FILENAME} file in ${sfdxProjectDataMoverPath}...`);
        }

        return sfdxProjectDataMoverPath;
    }

    static getObjectNameListFromExportFile(sfdxProjectDataMoverPath: string): string[]
    {
        let objectNameList = [];

        try
        {
            let exportFile = <DataMoverExportFile> FileSystemHelper.openJSONFile(sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`);

            exportFile.objects.forEach(object =>
            {
                let objectName = DataMoverHelper.getObjectNameFrom(object.query);
                objectNameList.push(objectName);
            });
        }
        catch (e)
        {
            throw new SfdxError(e);
        }

        return objectNameList;
    }


    static getObjectNameFrom(query: string): string
    {
        let objectName;

        let queryParts = query.split(' ');

        for (let i = 0; i < queryParts.length; i++)
        {
            if (queryParts[i].toLowerCase() !== 'from')
            {
                continue;
            }

            objectName = queryParts[i + 1];
        }

        return objectName;
    }

    static doesExportFileExist(sfdxProjectDataMoverPath: string): boolean
    {
        return fs.existsSync(sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`);
    }

    static copyDefaultExportFileTo(sfdxProjectDataMoverPath: string): void
    {
        let sourcePath = PathHelper.getDefaultDataMoverExportFilePath();
        let destinationPath = sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`;

        console.log(`Creating default ${CONSTANTS.DATA_MOVER_EXPORT_FILENAME} file in ${sfdxProjectDataMoverPath}...`);

        try
        {
            fs.copyFileSync(sourcePath, destinationPath);
        }
        catch (error)
        {
            throw new SfdxError(error);
        }
    }
}
