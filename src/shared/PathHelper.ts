import { SfdxProject } from "@salesforce/core";
import CONSTANTS from './constants';

export default class PathHelper
{
    static async getSfdxProjectPath()
    {
        const project = await SfdxProject.resolve();
        return project.getPath();
    }

    static getDefaultDataMoverExportFilePath()
    {
        return __dirname + '/../data/defaultDataMoverExportFile.json';
    }

    static async getSfdxProjectDataMoverFolderPath(): Promise<string>
    {
        return await PathHelper.getSfdxProjectPath() + `\\${CONSTANTS.DATA_MOVER_FOLDER_NAME}`;
    }

    static async getSfdxProjectDataMoverFilePath(): Promise<string>
    {
        return await PathHelper.getSfdxProjectDataMoverFolderPath() + `\\${CONSTANTS.DATA_MOVER_EXPORT_FILENAME}`;
    }
}
