import { ConfigAggregator, SfdxError } from "@salesforce/core";
import GitHelper from "./GitHelper";

export default class UsernameService
{
    static async getFlagOrDefaultUsername(flagUsername: string): Promise<string>
    {
        let username;

        if (flagUsername)
        {
            username = flagUsername;
        }
        else // Get the username from sfdx-config.json
        {
            const aggregator = await ConfigAggregator.create();
            username = aggregator.getPropertyValue('defaultusername');
        }

        return username;
    }

    // Fonteva Client Usernames should be all lower case and follow the convention {clientName}-{orgType}
    // Ex. wef-full, asa-prod, amt-uat
    static async calculateFontevaClientUsername(clientFlagValue: string, orgType: string): Promise<string>
    {
        let clientName = clientFlagValue ? clientFlagValue : await GitHelper.getCurrentRepoName();

        if (!clientName)
        {
            throw new SfdxError('This command requires a client name or acronym (use -c or --client)');
        }

        return `${clientName.toLowerCase()}-${orgType}`;
    }
}
