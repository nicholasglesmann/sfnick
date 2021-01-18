import { exec } from 'child_process';
import CONSTANTS from './constants';

export default class SfdxHelper
{
    static forceOrgOpen(username: string, path?: string): Promise<any>
    {
        let sfdxCommand = `sfdx force:org:open -u ${username}`;

        if (path)
        {
            sfdxCommand +=  ` -p ${path}`;
        }

        console.log(`Opening org ${username}`);

        return new Promise((resolve, reject) =>
        {
            exec(sfdxCommand, (error, data, stderr) =>
            {
                if (error) { reject(error); }

                if (stderr) { reject(stderr); }

                resolve(data);
            });
        })
        .catch(error =>
        {
            console.log(`Error opening ${username}: ${error}`);
        });
    }


    static forceSourceValidate(username: string): Promise<any>
    {
        SfdxHelper.forceOrgOpen(username, CONSTANTS.ORG_URLS.DEPLOYMENT_STATUS);

        let sfdxCommand = `sfdx force:source:deploy -c -p force-app -l RunLocalTests  -u ${username}`;

        console.log(`Validating force-app/main/default/ metadata in org ${username}...`);

        return new Promise((resolve, reject) =>
        {
            exec(sfdxCommand, (error, data, stderr) =>
            {
                if (error) { reject(error); }

                if (stderr) { reject(stderr); }

                resolve(data);
            });
        })
        .catch(error =>
        {
            console.log(`Error validating ${username}: ${error}`);
        });
    }
}
