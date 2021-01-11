export default class GitHelper
{
    static async getCurrentRepoName(): Promise<String>
    {
        const { promisify } = require('util');
        const exec = promisify(require('child_process').exec)

        let repoUrlCommand = 'git config --get remote.origin.url';

        let repoUrl = await exec(repoUrlCommand);

        let repoNameCommand = `basename -s .git ${repoUrl.stdout.trim()}`;

        let repoName = await exec(repoNameCommand);

        return repoName.stdout.trim().toLowerCase();
    }
}
