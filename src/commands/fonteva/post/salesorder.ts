import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
// import DataMoverService from '../../../shared/DataMoverService';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
// import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfnick', 'fon');

export default class ModifyField extends SfdxCommand
{
    public static fieldValueSeperator = '==';
    public static valueIsAFieldIndicator = '**';
    public static fieldValuePairSeperator = '&&';

    public static description = messages.getMessage('modify.field.description');
    public static examples = [
        `$ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName${ModifyField.fieldValueSeperator}Bob" -f "FirstName = null"`,
        `$ sfdx fonteva:modify:field -u scratch-org -o Account -m "AdditionalPhone${ModifyField.fieldValueSeperator}${ModifyField.valueIsAFieldIndicator}Phone" -f "AdditionalPhone = null"`,
        `$ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName${ModifyField.fieldValueSeperator}Bob${ModifyField.fieldValuePairSeperator}Title${ModifyField.fieldValueSeperator}${ModifyField.valueIsAFieldIndicator}LastName" -f "FirstName = null"`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        object: flags.string({
            char: 'o',
            required: true,
            description: messages.getMessage('modify.field.flags.object')
        }),
        mapping: flags.string({
            char: 'm',
            required: true,
            description: messages.getMessage('modify.field.flags.mapping')
        }),
        filter: flags.string({
            char: 'f',
            required: false,
            description: messages.getMessage('modify.field.flags.filter')
        }),
        allowprod: flags.boolean({
            char: 'z',
            required: false,
            description: messages.getMessage('modify.field.flags.allowprod')
        }),
        disabletriggersvalidationrules: flags.boolean({
            char: 't',
            required: false,
            description: messages.getMessage('modify.field.flags.disabletriggersvalidationrules')
        })
    };

    public async run(): Promise<any>
    {
        throw new Error("Not implemented");

        const conn = await OrgService.getConnFromOrg(this.org);

        let valuesByFieldNameMap = this._getValuesByFieldNameMapFromInputFieldValueMapping(this.flags.mapping);

        let fieldsToQuery = this._getFieldNameListFromInputFieldValueMapping(this.flags.mapping);

        let query = this._buildQuery(this.flags.object, fieldsToQuery, this.flags.filter);

        try
        {
            let recordsToModify = await OrgService.queryRecords(query, conn);

            recordsToModify.forEach(recordToModify =>
            {
                recordToModify = this._modifyRecord(recordToModify, valuesByFieldNameMap);
            });

            console.log(recordsToModify.length);

            // let orgCrudOperator = new OrgDMLOperator(conn, this.flags.object);
            // await orgCrudOperator.run(OperationType.Update, recordsToModify);
        }
        catch (err)
        {
            cli.action.stop();
            console.error(err.message); // Maybe should throw error here?
        }
    }


    private _modifyRecord(recordToModify: object, valuesByFieldNameMap: object): object
    {
        for (let fieldName in valuesByFieldNameMap)
        {
            let value = valuesByFieldNameMap[fieldName];

            if (this._isValueAnotherField(value))
            {
                recordToModify[fieldName] = recordToModify[this._getFieldNameFromValue(value)];
            }
            else
            {
                recordToModify[fieldName] = value;
            }
        }

        return recordToModify;
    }


    private _isValueAnotherField(value: string): boolean
    {
        return value.startsWith(ModifyField.valueIsAFieldIndicator);
    }

    private _getFieldNameFromValue(value: string): string
    {
        return value.replace(ModifyField.valueIsAFieldIndicator, '');
    }

    private _buildQuery(objectName: string, fieldsToQuery: Array<string>, filter: string): string
    {
        let query = `SELECT `;

        for (let i = 0; i < fieldsToQuery.length; i++)
        {
            if (i > 0)
            {
                query += ', ';
            }

            query += fieldsToQuery[i];
        }

        query += ` FROM ${objectName}`;

        if (this.flags.filter)
        {
            query += ` WHERE ${this.flags.filter}`;
        }

        return query;
    }

    private _getFieldNameListFromInputFieldValueMapping(mapping: string): Array<string>
    {
        let fieldNames = [];

        let individualFieldValueMappings = mapping.split(ModifyField.fieldValuePairSeperator);

        individualFieldValueMappings.forEach(individualMapping =>
        {
            let fieldAndValue = individualMapping.split(ModifyField.fieldValueSeperator);

            let fieldName = fieldAndValue[0];
            let value = fieldAndValue[1];

            fieldNames.push(fieldName);

            if (this._isValueAnotherField(value))
            {
                fieldNames.push(this._getFieldNameFromValue(value));
            }
        });

        return fieldNames;
    }

    private _getValuesByFieldNameMapFromInputFieldValueMapping(mapping: string): any
    {
        let valuesByFieldNameMap = {};

        let individualFieldValueMappings = mapping.split(ModifyField.fieldValuePairSeperator);

        individualFieldValueMappings.forEach(individualMapping =>
        {
            let fieldAndValue = individualMapping.split(ModifyField.fieldValueSeperator);

            let fieldName = fieldAndValue[0];
            let value = fieldAndValue[1];

            valuesByFieldNameMap[fieldName] = value;
        });

        return valuesByFieldNameMap;
    }
}
