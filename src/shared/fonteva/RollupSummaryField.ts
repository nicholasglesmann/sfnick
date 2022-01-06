export default class RollupSummaryField
{
    public serializeMapping?: string;
    public relationshipField: string;
    public parentSObject: string;
    public parentField: string;
    public parentBatchScope: number;
    public operation: string;
    public namespace: string;
    public isEnabled: boolean;
    public filter: string;
    public enableTrigger: boolean;
    public enableBatching: boolean;
    public deserializeMapping?: string;
    public configId: string;
    public childSObject: string;
    public childField: string;
    public childBatchScope: number;

    public toApex()
    {

    }
}
