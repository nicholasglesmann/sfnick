import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { Record } from 'jsforce';
import DataMoverService from '../../../shared/DataMoverService';
import cli from 'cli-ux';
import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';
import { performance } from 'perf_hooks';
import OrgService from '../../../shared/OrgService';
import FlagMessage from '../../../shared/ui/FlagMessage';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class CreateTestData extends SfdxCommand
{
    public static description = messages.getMessage('create.testdata.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        object: flags.string({
            char: 'o',
            required: true,
            description: FlagMessage.object('create test data')
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: FlagMessage.disableTriggersValidationRules('creating test data')
        })
    };

    public async run(): Promise<JsonMap>
    {
        const conn = await OrgService.getConnFromOrg(this.org);

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        }

        let recordsToCreate:Array<Record> = [];

        let iteration = 7;

        for (let i = 0; i <= 100; i++)
        {
            let contact: Record = {};
            contact.attributes = { type: 'Contact' };
            contact.FirstName = 'Test' + iteration + i;
            contact.LastName = 'Test' + iteration + i;
            // contact.Legacy_Contact_Id__c = 'Test' + iteration + i + i;
            // contact.External_Id__c = 'Test' + iteration + i + i;
            recordsToCreate.push(contact);
        }

        try
        {
            cli.action.start(`Creating test ${this.flags.object} records`);

            let executionStartTime = performance.now();

            let orgCrudOperator = new OrgDMLOperator(conn, 'Contact');
            await orgCrudOperator.run(OperationType.insert, recordsToCreate);

            let executionEndTime = performance.now();

            let executionTotalTime = Math.floor((executionEndTime - executionStartTime) / 1000);

            cli.action.stop(`all ${this.flags.object} records were created in ${executionTotalTime} seconds!`);
        }
        catch (err)
        {
            cli.action.stop();
            console.error(err);
        }

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'enable');
        }

        console.log('Test data creation operation completed!');

        return null;
    }
}
