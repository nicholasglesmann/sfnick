import { SfdxError } from '@salesforce/core';
import PromiseHelper from './PromiseHelper';
import CONSTANTS from './constants';

export default class SfdxHelper
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
            sfdxCommand +=  ` -p ${path}`;
        }

        return PromiseHelper.promisifyCommand(sfdxCommand, `Error opening ${username}!`);
    }


    static forceSourceValidate(username: string): Promise<any>
    {
        SfdxHelper.forceOrgOpen(username, CONSTANTS.ORG_URLS.DEPLOYMENT_STATUS);

        let sfdxCommand = `sfdx force:source:deploy -c -p force-app -l RunLocalTests  -u ${username}`;

        console.log(`Validating all force-app metadata in org ${username}...`);

        return PromiseHelper.promisifyCommand(sfdxCommand, `Error validating ${username}!`);
    }
}
