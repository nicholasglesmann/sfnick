import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';
import FlagMessage from '../../../shared/ui/FlagMessage';
import Stylize from '../../../shared/ui/Stylize';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DeactivateUsers extends SfdxCommand
{
    public static description = messages.getMessage('create.users.description');
    public static examples = [
        `sfdx fonteva:deactivate:users`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        filter: flags.string({
            char: 'f',
            required: false,
            description: FlagMessage.query(`${Stylize.danger('deactivate')} users`)
        })
    };

    public async run(): Promise<any>
    {
        const conn = await OrgService.getConnFromOrg(this.org);

        let userQuery = `SELECT Id, IsActive, IsPortalEnabled, Country, State FROM User`;

        if (this.flags.filter)
        {
            userQuery += ` WHERE ${this.flags.filter}`;
        }

        try
        {
            let objectName = DataMoverService.getObjectNameFromQuery(userQuery);

            let userRecords = await OrgService.queryRecords(userQuery, conn);

            userRecords.forEach(userRecord =>
            {
                console.log(userRecord);
                userRecord.IsActive = true;
                userRecord.IsPortalEnabled = true;
                // userRecord.Country = ' ';
                // userRecord.State = ' ';
                console.log(userRecord);
            });

            console.log(userRecords.length);

            let orgCrudOperator = new OrgDMLOperator(conn, objectName);
            orgCrudOperator.batchSize = 1;
            await orgCrudOperator.run(OperationType.update, userRecords);
        }
        catch (err)
        {
            cli.action.stop();
            console.error(err.message); // Maybe should throw error here?
        }
    }
}
