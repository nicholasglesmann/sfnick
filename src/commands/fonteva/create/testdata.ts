import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import { Record } from 'jsforce';
import DataMoverService from '../../../shared/DataMoverService';
import cli from 'cli-ux';
import { OrgCrudOperator, OperationType } from '../../../shared/OrgCrudOperator';
import { performance } from 'perf_hooks';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class DestroyData extends SfdxCommand
{
    public static description = messages.getMessage('data.destroy.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        object: flags.string({
            char: 'o',
            required: true,
            description: messages.getMessage('data.destroy.flags.object')
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: messages.getMessage('data.destroy.flags.disabletriggersvalidationrules')
        })
    };

    public async run(): Promise<JsonMap>
    {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        }

        let recordsToCreate:Array<Record> = [];

        let iteration = 6;

        for (let i = 0; i <= 20; i++)
        {
            let contact: Record = {};
            contact.attributes = { type: 'Contact' };
            contact.FirstName = 'Test' + iteration + i;
            contact.LastName = 'Test' + iteration + i;
            // contact.Legacy_Contact_Id__c = 'Test' + iteration + i + i;
            contact.External_Id__c = 'Test' + iteration + i + i;
            recordsToCreate.push(contact);
        }

        try
        {
            cli.action.start(`Creating test ${this.flags.object} records`);

            let executionStartTime = performance.now();

            let orgCrudOperator = new OrgCrudOperator(conn, 'Contact');
            await orgCrudOperator.run(OperationType.Create, recordsToCreate);

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
