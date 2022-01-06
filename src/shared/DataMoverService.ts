import PromiseService from "./PromiseService";
import * as fs from 'fs';
import { Connection, SfdxError } from "@salesforce/core";
import FilePathService from './FilePathService';
import FileSystemService from './FileSystemService';
import CONSTANTS from './constants';
import DataMoverExportFile from "../types/DataMoverExportFile";
import OrgService from "./OrgService";
import { OrgDMLOperator, OperationType } from "./OrgDMLOperator";
import cli from 'cli-ux'

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

    static async transfer(sourceusername: string, targetusername: string, folderNameOverride?: string, productionDomain?: string)
    {
        if (targetusername !== 'csvfile')
        {
            await DataMoverService.toggleTriggersAndValidationRules(targetusername, 'disable');
        }

        let sfdxProjectDataMoverPath = await DataMoverService.calculateDataMoverFolderPathToUse(folderNameOverride);

        let dataMoverCommand = `sfdx sfdmu:run --sourceusername ${sourceusername} --targetusername ${targetusername}`;

        if (productionDomain)
        {
            dataMoverCommand += ` --canmodify ${productionDomain}`;
        }

        dataMoverCommand += ` --path "${sfdxProjectDataMoverPath}"`;

        console.log(`Source username: ${sourceusername}`);
        console.log(`Target username: ${targetusername}`);

        await PromiseService.promisifyCommand(dataMoverCommand, `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`);

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
            let exportFile = <DataMoverExportFile>FileSystemService.openJSONFile(sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`);

            exportFile.objects.forEach(object =>
            {
                let query = object.query.replace(' all ', ' Id ');

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
            if (queryParts[i].toLowerCase() === 'from')
            {
                objectName = queryParts[i + 1];
                break;
            }
        }

        return objectName;
    }

    static getobjectNameListFromExportFile(sfdxProjectDataMoverPath: string): string[]
    {
        let objectNameList = [];

        try
        {
            let exportFile = <DataMoverExportFile>FileSystemService.openJSONFile(sfdxProjectDataMoverPath + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`);

            exportFile.objects.forEach(object =>
            {
                let objectName = DataMoverService.getObjectNameFromQuery(object.query);

                objectNameList.push(objectName);
            });
        }
        catch (e)
        {
            throw new SfdxError(e);
        }

        return objectNameList;
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

    static async toggleTriggersAndValidationRules(username: string, disableOrEnable: string): Promise<void>
    {
        if (username === 'csvfile')
        {
            return console.log('Source username is "csvfile", no need to toggle triggers/validation rules.');
        }

        let logMessage = disableOrEnable === 'disable' ? 'Disabling triggers/validation' : 'Enabling triggers/validation';

        cli.action.start(logMessage);

        let anonApexPath = FilePathService.getToggleTriggersAndValidationAnonApexFilePath(disableOrEnable);

        let sfdxCommand = `sfdx force:apex:execute -u ${username} -f ${anonApexPath} --loglevel error`;

        let errorMessage = `Error running command. Make sure sfdmu is installed (use sfdx plugins:install sfdmu).`;

        await PromiseService.promisifyCommand(sfdxCommand, errorMessage, false);

        cli.action.stop('Done!');
    }


    static async repairPriceRules(sourceusername: string, targetusername: string)
    {
        let sourceOrgConn = await OrgService.getConnFromUsername(sourceusername);
        let targetOrgConn = await OrgService.getConnFromUsername(targetusername);

        let badgeTypeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Badge_Type__c', 'Name', sourceOrgConn, targetOrgConn);
        let sourceCodeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Source_Code__c', 'Name', sourceOrgConn, targetOrgConn);
        let subscriptionPlanOldIdToNewIdMap = await this.buildOldIdToNewIdMap('OrderApi__Subscription_Plan__c', 'Name', sourceOrgConn, targetOrgConn);

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

        let orgCrudOperator = new OrgDMLOperator(targetOrgConn, sObjectName);
        await orgCrudOperator.run(OperationType.update, recordsToRepair);
    }


    static async repairJoinProcess(sourceusername: string, targetusername: string): Promise<void>
    {
        let targetOrgConn = await OrgService.getConnFromUsername(targetusername);

        let joinProcessQuery = 'SELECT Id, joinapi__Is_Published__c FROM joinapi__Join_Process__c WHERE joinapi__Is_Published__c = true';
        let joinProcessRecordsToRepair = await OrgService.queryRecords(joinProcessQuery, targetOrgConn);

        let joinStepQuery = 'SELECT Id, joinapi__Is_Published__c FROM joinapi__Step__c WHERE joinapi__Is_First_Step__c = true AND joinapi__Is_Published__c = true';
        let joinStepRecordsToRepair = await OrgService.queryRecords(joinStepQuery, targetOrgConn);

        let joinProcessRecordsPublished = joinProcessRecordsToRepair.map(record => Object.assign({}, record));
        let joinStepRecordsPublished = joinStepRecordsToRepair.map(record => Object.assign({}, record));

        joinProcessRecordsToRepair.forEach(record => {
            record.joinapi__Is_Published__c = false;
        });

        joinStepRecordsToRepair.forEach(record => {
            record.joinapi__Is_Published__c = false;
        });

        let joinProcessOperator = new OrgDMLOperator(targetOrgConn, 'joinapi__Join_Process__c');
        await joinProcessOperator.run(OperationType.update, joinProcessRecordsToRepair);

        let joinStepOperator = new OrgDMLOperator(targetOrgConn, 'joinapi__Step__c');
        await joinStepOperator.run(OperationType.update, joinStepRecordsToRepair);

        await joinStepOperator.run(OperationType.update, joinStepRecordsPublished);

        await joinProcessOperator.run(OperationType.update, joinProcessRecordsPublished);
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
                newIds.push(oldId); // Leave the old Id in place
                console.log(`Old Id ${oldId} was missing from map!`);
            }
        });

        return newIds.join(',');
    }

    static async buildOldIdToNewIdMap(objectName: string, externalIdQuery: string, sourceOrgConn: Connection, targetOrgConn: Connection)
    {
        let recordExternalIdToOldAndNewIdMap = {};

        let oldIdToNewIdMap = {};

        let objectQuery = `SELECT Id, ${externalIdQuery} FROM ${objectName}`;

        let externalIdFields = externalIdQuery.split(',').map(fieldName => fieldName.trim()); // remove unnecessary spaces around field names

        let sourceRecords = await OrgService.queryRecords(objectQuery, sourceOrgConn);
        let targetRecords = await OrgService.queryRecords(objectQuery, targetOrgConn);

        sourceRecords.forEach(record =>
        {
            let externalId = DataMoverService.calculateExternalId(record, externalIdFields);

            if (!recordExternalIdToOldAndNewIdMap[externalId])
            {
                recordExternalIdToOldAndNewIdMap[externalId] = {};
            }

            recordExternalIdToOldAndNewIdMap[externalId].oldId = record.Id;
        });

        let targetExternalIds = [];

        targetRecords.forEach(record =>
        {
            let externalId = DataMoverService.calculateExternalId(record, externalIdFields);

            targetExternalIds.push(externalId);

            if (!recordExternalIdToOldAndNewIdMap[externalId])
            {
                recordExternalIdToOldAndNewIdMap[externalId] = {};
            }

            recordExternalIdToOldAndNewIdMap[externalId].newId = record.Id;
        });

        // targetExternalIds.forEach(id =>
        // {
        //     console.log(id);
        // });

        // console.log(recordExternalIdToOldAndNewIdMap);
        // console.log(Object.keys(recordExternalIdToOldAndNewIdMap).length);

        for (const recordExternalId in recordExternalIdToOldAndNewIdMap)
        {
            if (!recordExternalIdToOldAndNewIdMap.hasOwnProperty(recordExternalId))
            {
                continue;
            }

            let oldAndNewIdObj = recordExternalIdToOldAndNewIdMap[recordExternalId];

            if (!oldAndNewIdObj.oldId)
            {
                console.log(`Old Id missing for ${objectName} record with name: ${recordExternalId}`);
                continue;
            }

            if (!oldAndNewIdObj.newId)
            {
                console.log(`New Id missing for ${objectName} record with name: ${recordExternalId}`);
                continue;
            }

            oldIdToNewIdMap[oldAndNewIdObj.oldId.substr(0,15)] = oldAndNewIdObj.newId;  // 15 character old SF Id
            oldIdToNewIdMap[oldAndNewIdObj.oldId] = oldAndNewIdObj.newId;               // 18 character old SF Id
            oldIdToNewIdMap[oldAndNewIdObj.newId] = oldAndNewIdObj.newId;               // If newId is found, keep it the same
        }

        return oldIdToNewIdMap;
    }

    static calculateExternalId(record: any, externalIdFields: string[]): string
    {
        let externalId = '';

        for (let i = 0; i < externalIdFields.length; i++)
        {
            if (i > 0)
            {
                externalId += ':';
            }

            let value = DataMoverService.getNextPieceOfExternalId(record, externalIdFields[i]);

            externalId += value;
        }

        return externalId;
    }

    static getNextPieceOfExternalId(record: any, externalId: string): string
    {
        let value;

        let externalIdParts = externalId.split('.');

        for(let i = 0; i < externalIdParts.length; i++)
        {
            value = i == 0 ? record[externalIdParts[i]] : value?.[externalIdParts[i]];
        }

        return value;
    }

    static async repairPriceRuleVariables(sourceusername: string, targetusername: string)
    {
        let sourceOrgConn = await OrgService.getConnFromUsername(sourceusername);
        let targetOrgConn = await OrgService.getConnFromUsername(targetusername);

        let recordTypeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('RecordType', 'Name', sourceOrgConn, targetOrgConn);

        let sObjectToRepair = 'OrderApi__Price_Rule_Variable__c';

        let fieldToRepair = 'OrderApi__Value__c';

        let recordsToRepairQuery = `SELECT Id, ${fieldToRepair}
                                    FROM ${sObjectToRepair}`;

        let recordsToRepair = await OrgService.queryRecords(recordsToRepairQuery, targetOrgConn);

        recordsToRepair.forEach(record =>
        {
            if (record[fieldToRepair])
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(recordTypeOldIdToNewIdMap, record[fieldToRepair]);
                record[fieldToRepair] = newValue;
            }
        });

        let orgCrudOperator = new OrgDMLOperator(targetOrgConn, sObjectToRepair);
        await orgCrudOperator.run(OperationType.update, recordsToRepair);
    }


    static async repairSkipLogicRules(sourceusername: string, targetusername: string)
    {
        let sourceOrgConn = await OrgService.getConnFromUsername(sourceusername);
        let targetOrgConn = await OrgService.getConnFromUsername(targetusername);

        let fieldOldIdToNewIdMap = await this.buildOldIdToNewIdMap('PagesApi__Field__c', 'PagesApi__Form__r.Name,PagesApi__Field_Group__r.Name,Name,PagesApi__Order__c', sourceOrgConn, targetOrgConn);

        let sObjectToRepair = 'PagesApi__Skip_Logic_Rule__c';

        let fieldToRepair = 'PagesApi__Destination__c';

        let recordsToRepairQuery = `SELECT Id, ${fieldToRepair}
                                    FROM ${sObjectToRepair}`;

        let recordsToRepair = await OrgService.queryRecords(recordsToRepairQuery, targetOrgConn);

        recordsToRepair.forEach(record =>
        {
            if (record[fieldToRepair])
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(fieldOldIdToNewIdMap, record[fieldToRepair]);
                record[fieldToRepair] = newValue;
            }
        });

        let orgCrudOperator = new OrgDMLOperator(targetOrgConn, sObjectToRepair);
        await orgCrudOperator.run(OperationType.update, recordsToRepair);
    }

    static async repairFieldRecords(sourceusername: string, targetusername: string)
    {
        let sourceOrgConn = await OrgService.getConnFromUsername(sourceusername);
        let targetOrgConn = await OrgService.getConnFromUsername(targetusername);

        let recordTypeOldIdToNewIdMap = await this.buildOldIdToNewIdMap('RecordType', 'Name', sourceOrgConn, targetOrgConn);

        let sObjectToRepair = 'PagesApi__Field__c';

        let fieldToRepair = 'PagesApi__Hidden_Field_Value__c';

        let recordsToRepairQuery = `SELECT Id, ${fieldToRepair}
                                    FROM ${sObjectToRepair}`;

        let recordsToRepair = await OrgService.queryRecords(recordsToRepairQuery, targetOrgConn);

        recordsToRepair.forEach(record =>
        {
            if (record[fieldToRepair])
            {
                let newValue = this.getCorrectSalesforceIdFieldValue(recordTypeOldIdToNewIdMap, record[fieldToRepair]);
                record[fieldToRepair] = newValue;
            }
        });

        let orgCrudOperator = new OrgDMLOperator(targetOrgConn, sObjectToRepair);
        await orgCrudOperator.run(OperationType.update, recordsToRepair);
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
