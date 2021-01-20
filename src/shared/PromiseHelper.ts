import { exec } from "child_process";
import { spawn } from 'cross-spawn';

export default class PromiseHelper
{
    static promisifyCommand(command: string, errorMessage: string): Promise<any>
    {
        return new Promise((resolve, reject) => {

            let commandProcess = exec(command, (error, data, stderr) =>
            {
                if (error) { reject(error); }

                //if (stderr) { reject(stderr); }

                resolve(data);
            });

            commandProcess.stdout.on('data', function (data)
            {
                console.log(data);
            });

            commandProcess.stderr.on('data', function (data)
            {
                console.log(data);
            });

            // commandProcess.stdout.pipe(process.stdout);
            // commandProcess.stdout.pipe(process.stderr);
        })
        .catch(error => {
            console.log(errorMessage);
            console.log(error);
        });
    }

    static async promisifySpawnCommand(command: string, cmdArgs: string[], errorMessage: string): Promise<void>
    {
        // let path = await PathHelper.getSfdxProjectPath();

        // console.log(path);

        return new Promise((resolve, reject) => {

            let sfdx = spawn(command, cmdArgs, { stdio: 'inherit' });

            sfdx.on('error', function (err) { throw err });

            sfdx.on('exit', function (error)
            {
                if (error)
                {
                    console.log(errorMessage);
                    console.log(error);
                    // reject();
                }
                else
                {
                    resolve();
                }
            });

        });
    }
}
