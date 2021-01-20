import * as fs from 'fs';

export default class FileSystemHelper
{
    static openJSONFile(filepath: string): object
    {
        let jsonFile = fs.readFileSync(filepath);

        return JSON.parse(jsonFile.toString());
    }
}

