import { SfdxError } from '@salesforce/core';
import PromiseService from './PromiseService';
import CONSTANTS from './constants';
import FilePathService from './FilePathService';

export default class SfdxService
{
    static forceOrgOpen(username: string, path?: string): Promise<any>
    {
        if (!username)
        {
            throw new SfdxError('No username entered! Use -u or --username');
        }

        console.log(`Opening org ${username}`);

        let sfdxCommand = `sfdx force:org:open -u ${username}`;

        if (path)
        {
            sfdxCommand += ` -p ${path}`;
        }

        return PromiseService.promisifyCommand(sfdxCommand, `Error opening ${username}!`);
    }


    static async forceSourceValidate(username: string): Promise<any>
    {
        SfdxService.forceOrgOpen(username, CONSTANTS.ORG_URLS.DEPLOYMENT_STATUS);

        let cleanMetadataCommand = `npm run cleanAll`;

        console.log(`Cleaning all metadata...`);

        await PromiseService.promisifyCommand(cleanMetadataCommand, `Error cleaning metadata! Make sure all npm packages are installed/updated.`);

        let sfdxCommand = `sfdx force:source:deploy -c -p force-app -l RunLocalTests -u ${username}`;

        console.log(`Validating all force-app metadata in org ${username}...`);

        return PromiseService.promisifyCommand(sfdxCommand, `Error validating ${username}!`);
    }

    static forceOrgCreate(alias: string, devHub: string): Promise<any>
    {
        console.log(`Creating scratch org ${alias}`);

        let scratchOrgConfigFilePath = FilePathService.getScratchOrgConfigFilePath();

        let sfdxCommand = `sfdx force:org:create -d 30 -f ${scratchOrgConfigFilePath} -a ${alias} -v ${devHub}`;

        return PromiseService.promisifyCommand(sfdxCommand, `Error creating scratch org ${alias}!`);
    }

}
