export default class RegisteredObject
{
    public validationDisabled: boolean;

    public triggersEnabled: boolean;

    public soqlOrderBy: string;

    public soqlLimit: string;

    public sObjectName: string;

    public salesforceId: string;

    public orderBy: string;

    public namespace: string;

    public isStandard: boolean;

    public isEnabled: boolean;

    public apexClass: string;

    public toApex(): string
    {
        let apexCode = '';

        apexCode += 'Framework.RegisteredObject registeredObject = new Framework.RegisteredObject();';

        


        return apexCode;
    }
}
