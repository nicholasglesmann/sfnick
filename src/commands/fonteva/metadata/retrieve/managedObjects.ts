import { SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { JsonMap } from '@salesforce/ts-types';
import RetrieveHelper from '../../../../shared/RetrieveHelper';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class RetrieveManagedObjects extends SfdxCommand
{
    public static description = messages.getMessage('metadata.retrieve.managedObjects.description');
    public static examples = [];

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap>
    {
        const namespacesToRetrieve = ["DRCTS", "DonorApi", "EventApi", "Framework", "joinapi", "LTE", "OrderApi", "PagesApi", "PriceApi", "ProgramApi"];

        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();

        conn.describeGlobal((err, res) => {

            if (err) { throw new SfdxError(err.message); };

            let onlyNamespaceObjectDescribes = res.sobjects.filter(obj => namespacesToRetrieve.some(namespace => obj.name.includes(namespace) && obj.name.includes('__c')));

            let onlyNamespaceObjectNames = onlyNamespaceObjectDescribes.map(obj => obj.name);

            let results = {
                records: onlyNamespaceObjectNames
            };

            let retrieveHelper = new RetrieveHelper();

            retrieveHelper.retrieveMetadata(results, org.getUsername(), conn.getApiVersion(), 'CustomObject');
        });

        return null;
    }
}
