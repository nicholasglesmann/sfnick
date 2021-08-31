import { SfdxProject } from "@salesforce/core";
import CONSTANTS from './constants';

export default class FilePathService
{
    static async getSfdxProjectPath()
    {
        const project = await SfdxProject.resolve();
        return project.getPath();
    }

    static getDefaultDataMoverExportFilePath()
    {
        return __dirname + CONSTANTS.FILEPATH.DATA_MOVER_CONFIG;
    }

    static async getSfdxProjectDataMoverFolderPath(): Promise<string>
    {
        return await FilePathService.getSfdxProjectPath() + `\\${CONSTANTS.DATA_MOVER_FOLDER_NAME}`;
    }

    static async getSfdxProjectDataMoverFilePath(): Promise<string>
    {
        return await FilePathService.getSfdxProjectDataMoverFolderPath() + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`;
    }

    static getScratchOrgConfigFilePath()
    {
        return __dirname + CONSTANTS.FILEPATH.SCRATCH_ORG_CONFIG;
    }

    static async convertFolderNameToFullPath(folderName: string)
    {
        return await FilePathService.getSfdxProjectPath() + `\\${folderName.replace(/\//g, '\\')}`; // Replace all forward slashes with backslashes
    }

    static getToggleTriggersAndValidationAnonApexFilePath(disableOrEnable: string): string
    {
        let anonApexFileName = disableOrEnable === 'disable'
            ? CONSTANTS.FILEPATH.DISABLE_FONTEVA_TRIGGERS_VALIDATION_APEX
            : CONSTANTS.FILEPATH.ENABLE_FONTEVA_TRIGGERS_VALIDATION_APEX;

        return __dirname + anonApexFileName;
    }

    static getFontevaFrameworkConfigQueryAnonApexFilePath(): string
    {
        let anonApexFileName = CONSTANTS.FILEPATH.FONTEVA_FRAMEWORK_CONFIG_QUERY_APEX;

        return __dirname + anonApexFileName;
    }
}
