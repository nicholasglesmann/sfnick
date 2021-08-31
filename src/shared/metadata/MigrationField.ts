
export default class MigrationField
{
    public objectName: string;

    public fieldName: string = 'Fon_Config_Migration_Id__c';

    public description: string = 'An external id that uses a record\'s Salesforce Id to move records from org to org';

    public externalId: string = "true";

    public label: string = 'Config Migration Id';

    public length: number = 40;

    public required: boolean = false;

    public type: string = "Text";

    constructor(objectName: string)
    {
        this.objectName = objectName;
    }

    public get fullName()
    {
        return `${this.objectName}.${this.fieldName}`;
    }

    public toPlainObject(): object
    {
        let plainObject: any = {};

        plainObject.fullName = this.fullName;
        plainObject.description = this.description;
        plainObject.externalId = this.externalId;
        plainObject.label = this.label;
        plainObject.length = this.length;
        plainObject.required = this.required;
        plainObject.type = this.type;

        return plainObject;
    }
}
