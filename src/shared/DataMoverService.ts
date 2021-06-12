import PromiseHelper from "./PromiseHelper";
import * as fs from 'fs';
import { Connection, SfdxError } from "@salesforce/core";
import FilePathService from './FilePathService';
import FileSystemHelper from './FileSystemHelper';
import CONSTANTS from './constants';
import DataMoverExportFile from "../types/DataMoverExportFile";
import OrgService from "./OrgService";
import { OrgCrudOperator, OperationType } from "./OrgCrudOperator";

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
        if (targetusername !== 'csvfile')
        {
            await DataMoverService.toggleTriggersAndValidationRules(targetusername, 'disable');
        }

        let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(folderNameOverride);

        let dataMoverCommand = `sfdx sfdmu:run --sourceusername ${sourceusername} --targetusername ${targetusername} --path "${sfdxProjectDataMoverPath}"`;

        console.log(`Source username: ${sourceusername}`);
        console.log(`Target username: ${targetusername}`);

        await PromiseHelper.promisifyCommand(dataMoverCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);

        await DataMoverService.reassignSalesforceIdReferences(sourceusername, targetusername);

        if (targetusername !== 'csvfile')
        {
            await DataMoverService.toggleTriggersAndValidationRules(targetusername, 'enable');
        }

        return null;
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

        let logMessage = disableOrEnable === 'disable' ? 'Disabling triggers/validation...' : 'Enabling triggers/validation...';

        console.log(logMessage);

        let anonApexPath = FilePathService.getToggleTriggersAndValidationAnonApexFilePath(disableOrEnable);

        let sfdxCommand = `sfdx force:apex:execute -u ${username} -f ${anonApexPath} --loglevel error`;

        let errorMessage = `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`;

        return PromiseHelper.promisifyCommand(sfdxCommand, errorMessage, false);
    }


    static async reassignSalesforceIdReferences(sourceusername: string, targetusername: string)
    {
        let sourceOrgConn = await OrgService.getConnFrom(sourceusername);
        let targetOrgConn = await OrgService.getConnFrom(targetusername);

        let badgeTypeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Badge_Type__c', sourceOrgConn, targetOrgConn);
        let sourceCodeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Source_Code__c', sourceOrgConn, targetOrgConn);
        let subscriptionPlanOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Subscription_Plan__c', sourceOrgConn, targetOrgConn);

        let sObjectName = 'OrderApi__Price_Rule__c';

        let recordsToRepairQuery = `SELECT Id, OrderApi__Required_Badge_Types__c, OrderApi__Required_Subscription_Plans__c, OrderApi__Required_Source_Codes__c
                                    FROM ${sObjectName}`;

        let recordsToRepair = await OrgService.queryRecords(recordsToRepairQuery, targetOrgConn);

        recordsToRepair.forEach(record =>
        {
            if (record.OrderApi__Required_Badge_Types__c)
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(badgeTypeOldIdToNewIdMap, record.OrderApi__Required_Badge_Types__c);
                record.OrderApi__Required_Badge_Types__c = newValue;
            }

            if (record.OrderApi__Required_Subscription_Plans__c)
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(subscriptionPlanOldIdToNewIdMap, record.OrderApi__Required_Subscription_Plans__c);
                record.OrderApi__Required_Subscription_Plans__c = newValue;
            }

            if (record.OrderApi__Required_Source_Codes__c)
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(sourceCodeOldIdToNewIdMap, record.OrderApi__Required_Source_Codes__c);
                record.OrderApi__Required_Source_Codes__c = newValue;
            }
        });

        let orgCrudOperator = new OrgCrudOperator(targetOrgConn, sObjectName);
        orgCrudOperator.run(OperationType.Update, recordsToRepair);
    }


    static getCorrectSalesforceIdFieldValue(oldIdToNewIdMap: any, oldIdFieldValue: string): string
    {
        let oldIds = oldIdFieldValue.split(',');
        let newIds = [];

        oldIds.forEach(oldId =>
        {
            if (oldIdToNewIdMap[oldId])
            {
                newIds.push(oldIdToNewIdMap[oldId]);
            }
            else
            {
                console.log(`Old Id ${oldId} was missing from map!`);
            }
        });

        return newIds.join(',');
    }

    static async buildOldIdToNewIdMap(objectName: string, sourceOrgConn: Connection, targetOrgConn: Connection)
    {
        let recordNameToOldAndNewIdMap = {};

        let oldIdToNewIdMap = {};

        let objectQuery = `SELECT Id, Name FROM ${objectName}`;

        let sourceRecords = await OrgService.queryRecords(objectQuery, sourceOrgConn);
        let targetRecords = await OrgService.queryRecords(objectQuery, targetOrgConn);

        sourceRecords.forEach(record =>
        {
            if (!recordNameToOldAndNewIdMap[record.Name])
            {
                recordNameToOldAndNewIdMap[record.Name] = {};
            }

            recordNameToOldAndNewIdMap[record.Name].oldId = record.Id;
        });

        targetRecords.forEach(record =>
        {
            if (!recordNameToOldAndNewIdMap[record.Name])
            {
                recordNameToOldAndNewIdMap[record.Name] = {};
            }

            recordNameToOldAndNewIdMap[record.Name].newId = record.Id;
        });

        for (const recordName in recordNameToOldAndNewIdMap)
        {
            if (!recordNameToOldAndNewIdMap.hasOwnProperty(recordName))
            {
                continue;
            }

            let oldAndNewIdObj = recordNameToOldAndNewIdMap[recordName];

            if (!oldAndNewIdObj.oldId || !oldAndNewIdObj.newId)
            {
                console.log(`Possible problem with ${objectName} record with name: ${recordName}`);
                continue;
            }

            oldIdToNewIdMap[oldAndNewIdObj.oldId.substr(0,15)] = oldAndNewIdObj.newId;  // 15 character SF Id
            oldIdToNewIdMap[oldAndNewIdObj.oldId] = oldAndNewIdObj.newId;               // 18 character SF Id
        }

        return oldIdToNewIdMap;
    }






    // static async buildRecordCountAnonApexTest(conn: Connection, sfdxProjectDataMoverPath: string): Promise<string>
    // {
    //     let objectQueries = DataMoverService.getobjectQueryListFromExportFile(sfdxProjectDataMoverPath);



    //     for (let objectQuery of objectQueries)
    //     {
    //         try
    //         {
    //             let records = await OrgService.queryRecords(objectQuery, conn);

    //             let expectedRecordCount = records.length;

    //             let objectName = DataMoverService.getObjectNameFromQuery(objectQuery);

    //             // await this._deleteRecords(records, conn, objectName);
    //         }
    //         catch (err)
    //         {
    //             console.log(err);
    //         }
    //     }
    // }
}
