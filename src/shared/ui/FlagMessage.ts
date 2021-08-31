import Stylize from "./Stylize";

export default class FlagMessage
{
    static allowProd(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription}` : `allow command to run`;

        return `${descriptionLabel} in a ${Stylize.danger(Stylize.bold('PRODUCTION'))} org`;
    }

    static batchSize(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription}` : `executing command`;

        return `the batch size to use when ${descriptionLabel} (default: ${Stylize.bold('200')})`;
    }

    static disableTriggersValidationRules(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription}` : `executing command`;

        return `${Stylize.danger('disable')} ${Stylize.bold('ALL')} ${Stylize.fonBlue('Fonteva triggers/validation rules')} before ${descriptionLabel}; ${Stylize.success('re-enable')} ${Stylize.bold('ALL')} ${Stylize.fonBlue('Fonteva triggers/validation rules')} after ${descriptionLabel}`;
    }

    static object(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription}` : `run command using`;

        return `${descriptionLabel} the specified ${Stylize.bold('object')}`;
    }

    static pathOverride(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription} using` : `use`;

        return `${descriptionLabel} the ${Stylize.bold('export.json file')} at the specified ${Stylize.bold('path')}`;
    }

    static query(commandDescription?: string): string
    {
        let descriptionLabel = !!commandDescription ? `${commandDescription}` : `run command on results`;

        return `${descriptionLabel} returned from the specified ${Stylize.bold('query')}`;
    }

    static firstOrg(commandDescription?: string): string
    {
        // let descriptionLabel = !!commandDescription ? `${commandDescription}` : `run command using`;

        return `the first org SFDX username`;
    }

    static secondOrg(commandDescription?: string): string
    {
        // let descriptionLabel = !!commandDescription ? `${commandDescription}` : `run command using`;

        return `the second org SFDX username`;
    }
}
