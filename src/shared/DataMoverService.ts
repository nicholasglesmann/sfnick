import PromiseHelper from "./PromiseHelper";
import * as fs from 'fs';
import { Connection, SfdxError } from "@salesforce/core";
import FilePathService from './FilePathService';
import FileSystemHelper from './FileSystemHelper';
import CONSTANTS from './constants';
import DataMoverExportFile from "../types/DataMoverExportFile";
import OrgHelper from "./OrgHelper";

export default class DataMoverService
{
    static async createSfdxProjectDataMoverFolder(): Promise<string>
    {
        let sfdxProjectDataMoverPath = await FilePathService.getSfdxProjectDataMoverFolderPath();

        if (!fs.existsSync(sfdxProjectDataMoverPath))
        {
            console.log(`Creating folder ${sfdxProjectDataMoverPath}...`);
            fs.mkdirSync(sfdxProjectDataMoverPath);
        }

        return sfdxProjectDataMoverPath;
    }

    static async retrieve(sourceusername: string, folderNameOverride?: string): Promise<any>
    {
        let targetusername = 'csvfile';

        return DataMoverService.transfer(sourceusername, targetusername, folderNameOverride);
    }

    static async deploy(targetusername: string, folderNameOverride?: string): Promise<any>
    {
        let sourceusername = 'csvfile';

        return DataMoverService.transfer(sourceusername, targetusername, folderNameOverride);
    }

    static async transfer(sourceusername: string, targetusername: string, folderNameOverride?: string)
    {

        await DataMoverService.toggleTriggersAndValidationRules(targetusername, 'disable');

        let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(folderNameOverride);

        let dataMoverCommand = `sfdx sfdmu:run --sourceusername ${sourceusername} --targetusername ${targetusername} --path "${sfdxProjectDataMoverPath}"`;

        console.log(`Source username: ${sourceusername}`);
        console.log(`Target username: ${targetusername}`);

        await PromiseHelper.promisifyCommand(dataMoverCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);

        return DataMoverService.toggleTriggersAndValidationRules(targetusername, 'enable');
    }

    static async calculateDataMoverFolderPathToUse(folderNameOverride?: string): Promise<string>
    {
        return await (!folderNameOverride
            ? DataMoverService.getOrCreateDefaultDataMoverFolderPath()
            : FilePathService.convertFolderNameToFullPath(folderNameOverride)
        );
    }

    static async getOrCreateDefaultDataMoverFolderPath(): Promise<string>
    {
        let sfdxProjectDataMoverPath = await DataMoverService.createSfdxProjectDataMoverFolder();

        if (!DataMoverService.doesExportFileExist(sfdxProjectDataMoverPath))
        {
            DataMoverService.copyDefaultExportFileTo(sfdxProjectDataMoverPath);
        }
        else
        {
            console.log(`Using existing ${CONSTANTS.DATA_MOVER_EXPORT_FILENAME} file in ${sfdxProjectDataMoverPath}...`);
        }

        return sfdxProjectDataMoverPath;
    }

    static getobjectQueryListFromExportFile(sfdxProjectDataMoverPath: string): string[]
    {
        let objectQueryList = [];

        try
        {
            let exportFile = <DataMoverExportFile>FileSystemHelper.openJSONFile(sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`);

            exportFile.objects.forEach(object =>
            {
                let query = object.query.replace('all', 'id');

                objectQueryList.push(query);
            });
        }
        catch (e)
        {
            throw new SfdxError(e);
        }

        return objectQueryList;
    }


    static getObjectNameFromQuery(query: string): string
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
        let sourcePath = FilePathService.getDefaultDataMoverExportFilePath();
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

    static async toggleTriggersAndValidationRules(username: string, disableOrEnable: string): Promise<any>
    {
        if (username === 'csvfile')
        {
            return console.log('Source username is "csvfile", no need to toggle triggers/validation rules.');
        }

        let anonApexPath = FilePathService.getToggleTriggersAndValidationAnonApexFilePath(disableOrEnable);

        let sfdxCommand = `sfdx force:apex:execute -u ${username} -f ${anonApexPath}`;

        return PromiseHelper.promisifyCommand(sfdxCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);
    }

    static async buildRecordCountAnonApexTest(conn: Connection, sfdxProjectDataMoverPath: string): Promise<string>
    {
        let objectQueries = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);



        for (let objectQuery of objectQueries)
        {
            try
            {
                let records = await OrgHelper.queryRecords(objectQuery, conn);

                let expectedRecordCount = records.length;

                let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

                // await this._deleteRecords(records, conn, objectName);
            }
            catch (err)
            {
                console.log(err);
            }
        }
    }
}
