import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class CreateScratchOrg extends SfdxCommand
{
    public static description = messages.getMessage('create.scratchorg.description');
    public static examples = [];

    static supportsUsername = true;

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        // const conn = org.getConnection();
        await org.refreshAuth();

        console.log('Command not created yet...coming soon!');

        // SOURCE_ORG: flag from user
        // ALIAS: could be flag from user or calculated based on client's name
        // DEVHUB: could be flag from user or stored as a SET command

        // #1: Connect to SOURCE_ORG and retrieve installed packages in temp/
        // #2: Create scratch org using ALIAS and DEVHUB
        // #3: Deploy installed packages
        // #4: Construct a temporary .forceignore file that includes ignores needed to push metadata to scratch org
        // #5: Push metadata
        // #6: Revert .forceignore file to original state, even if there are errors pushing metadata

        return null;
    }
}
