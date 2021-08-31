import SfdxService from './SfdxService';
import CONSTANTS from './constants';
import UsernameService from './UsernameService';

export default class FontevaCommandService
{
    static async openFontevaClient(clientFlagValue: string, orgType: string): Promise<null>
    {
        let username = await UsernameService.calculateFontevaClientUsername(clientFlagValue, orgType);

        return SfdxService.forceOrgOpen(username, CONSTANTS.ORG_URLS.LIGHTNING_SETUP);
    }

    static async validateFontevaClient(clientFlagValue: string, orgType: string): Promise<null>
    {
        let username = await UsernameService.calculateFontevaClientUsername(clientFlagValue, orgType);

        return SfdxService.forceSourceValidate(username);
    }
}
