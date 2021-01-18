import SfdxHelper from './SfdxHelper';
import CONSTANTS from './constants';
import UsernameHelper from './UsernameHelper';

export default class FontevaCommandHelper
{
    static async openFontevaClient(clientFlagValue: string, orgType: string): Promise<null>
    {
        let username = await UsernameHelper.calculateFontevaClientUsername(clientFlagValue, orgType);

        return SfdxHelper.forceOrgOpen(username, CONSTANTS.ORG_URLS.LIGHTNING_SETUP);
    }

    static async validateFontevaClient(clientFlagValue: string, orgType: string): Promise<null>
    {
        let username = await UsernameHelper.calculateFontevaClientUsername(clientFlagValue, orgType);

        return SfdxHelper.forceSourceValidate(username);
    }
}
