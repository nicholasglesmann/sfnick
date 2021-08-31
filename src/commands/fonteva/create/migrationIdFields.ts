import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import FlagMessage from '../../../shared/ui/FlagMessage';
import Stylize from '../../../shared/ui/Stylize';
// import { Record } from 'jsforce';
// import DataMoverService from '../../../shared/DataMoverService';
// import cli from 'cli-ux';
// import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';
// import { performance } from 'perf_hooks';
// import OrgService from '../../../shared/OrgService';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class CreateMigrationIdFields extends SfdxCommand
{
    public static description = messages.getMessage('create.migrationIdFields.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: FlagMessage.pathOverride(`create ${Stylize.bold('Migration ID field(s)')} on objects specified in queries`)
        }),
        object: flags.string({
            char: 'o',
            required: false,
            description: FlagMessage.object('create a Migration ID field on')
        }),
        allowprod: flags.boolean({
            char: 'z',
            required: false,
            description: FlagMessage.allowProd(`create ${Stylize.bold('Migration ID field(s)')}`)
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: FlagMessage.disableTriggersValidationRules(`creating ${Stylize.bold('Migration ID field(s)')}`)
        })
    };

    public async run(): Promise<JsonMap>
    {
        // const conn = await OrgService.getConnFromOrg(this.org);

        // if (this.flags.disabletriggersvalidationrules)
        // {
        //     await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        // }

        // try
        // {
        //     cli.action.start(`Creating test ${this.flags.object} records`);

        //     let executionStartTime = performance.now();

        //     let orgCrudOperator = new OrgDMLOperator(conn, 'Contact');
        //     await orgCrudOperator.run(OperationType.insert, recordsToCreate);

        //     let executionEndTime = performance.now();

        //     let executionTotalTime = Math.floor((executionEndTime - executionStartTime) / 1000);

        //     cli.action.stop(`all ${this.flags.object} records were created in ${executionTotalTime} seconds!`);
        // }
        // catch (err)
        // {
        //     cli.action.stop();
        //     console.error(err);
        // }

        // if (this.flags.disabletriggersvalidationrules)
        // {
        //     await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'enable');
        // }

        // console.log('Test data creation operation completed!');

        return null;
    }
}
