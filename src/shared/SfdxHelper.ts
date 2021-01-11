import { exec } from 'child_process';

export default class SfdxHelper
{
    static forceOrgOpen(username: string, path?: string): Promise<any>
    {
        let sfdxCommand;

        if (path)
        {
            sfdxCommand = `sfdx force:org:open -u ${username} -p ${path}`;
        }
        else
        {
            sfdxCommand = `sfdx force:org:open -u ${username}`;
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


    static forceSourceValidate(username: string, path: string)
    {
        let sfdxCommand = `sfdx force:source:deploy -c -p force-app -l RunLocalTests -u ${username}`;

        console.log(`Validating force-app/main/default/ metadata in org ${username}...`);

        SfdxHelper.forceOrgOpen(username, path);

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
