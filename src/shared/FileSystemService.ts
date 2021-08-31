import * as fs from 'fs';
import FilePathService from './FilePathService';

export default class FileSystemService
{
    static openJSONFile(filepath: string): object
    {
        let jsonFile = fs.readFileSync(filepath);

        return JSON.parse(jsonFile.toString());
    }

    static async makeTempDir(): Promise<void>
    {
        let tempDirPath = await FilePathService.getSfdxProjectPath() + '/temp';

        if (!fs.existsSync(tempDirPath))
        {
            fs.mkdirSync(tempDirPath);
        }
    }
}

