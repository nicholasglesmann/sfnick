import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import OrgService from '../../../shared/OrgService';
import cli from 'cli-ux'
import { OrgDMLOperator, OperationType } from '../../../shared/OrgDMLOperator';
import OutputMessage from '../../../shared/ui/OutputMessage';
import DataMoverService from '../../../shared/DataMoverService';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfnick', 'fon');

export default class ModifyField extends SfdxCommand
{
    public static fieldValueSeperator = '==';
    public static valueIsAFieldIndicator = '**';
    public static fieldValuePairSeperator = '&&';
    public static valuesSeperator = '++';

    public static description = messages.getMessage('modify.field.description');
    public static examples = [
        `$ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName${ModifyField.fieldValueSeperator}Bob" -f "FirstName = null"`,
        `$ sfdx fonteva:modify:field -u scratch-org -o Account -m "AdditionalPhone${ModifyField.fieldValueSeperator}${ModifyField.valueIsAFieldIndicator}Phone" -f "AdditionalPhone = null"`,
        `$ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName${ModifyField.fieldValueSeperator}Bob${ModifyField.fieldValuePairSeperator}Title${ModifyField.fieldValueSeperator}${ModifyField.valueIsAFieldIndicator}LastName" -f "FirstName = null"`,
        `$ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName${ModifyField.fieldValueSeperator}Bob${ModifyField.fieldValuePairSeperator}Title${ModifyField.fieldValueSeperator}${ModifyField.valueIsAFieldIndicator}LastName${ModifyField.valuesSeperator}, ${ModifyField.valuesSeperator}${ModifyField.valueIsAFieldIndicator}FirstName" -f "FirstName = null"`
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
        }),
        batchsize: flags.string({
            char: 'b',
            required: false,
            description: messages.getMessage('modify.field.flags.batchsize')
        })
    };

    public async run(): Promise<any>
    {
        const conn = await OrgService.getConnFromOrg(this.org);

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'disable');
        }

        let valuesByFieldNameMap = this._getValuesByFieldNameMapFrom(this.flags.mapping);

        let fieldsToQuery = this._getFieldNameListFrom(this.flags.mapping);

        let query = this._buildQuery(this.flags.object, fieldsToQuery, this.flags.filter);

        try
        {
            let recordsToModify = await OrgService.queryRecords(query, conn);

            recordsToModify.forEach(recordToModify =>
            {
                // console.log(recordToModify);

                recordToModify = this._modifyRecord(recordToModify, valuesByFieldNameMap);
            });

            let orgCrudOperator = new OrgDMLOperator(conn, this.flags.object);

            if (this.flags.batchsize)
            {
                orgCrudOperator.batchSize = this.flags.batchsize;
            }

            await orgCrudOperator.run(OperationType.update, recordsToModify);
        }
        catch (err)
        {
            cli.action.stop();
            console.error(err.message); // Maybe should throw error here?
        }

        if (this.flags.disabletriggersvalidationrules)
        {
            await DataMoverService.toggleTriggersAndValidationRules(this.flags.targetusername, 'enable');
        }

        return OutputMessage.endCommand('Modify Field');
    }


    private _modifyRecord(recordToModify: object, valuesByFieldNameMap: object): object
    {
        for (let fieldName in valuesByFieldNameMap)
        {
            let values = this._getIndividualValues(valuesByFieldNameMap[fieldName]);

            let newValue = '';

            values.forEach(value =>
            {
                if (this._isValueAnotherField(value))
                {
                    newValue += this._getFieldValueFromRecord(recordToModify, value);
                    this._removeSourceFieldFromRecord(recordToModify, value);
                }
                else
                {
                    newValue += value;
                }
            });

            recordToModify[fieldName] = newValue;
        }

        // console.log(recordToModify);

        return recordToModify;
    }


    private _getFieldValueFromRecord(recordToModify: any, value: string): string
    {
        let fields = this._getFieldNameFromValue(value).split('.');

        return this._traverseRecordValue(recordToModify, fields);
    }


    private _traverseRecordValue(currentRecord, values): any
    {
        if (values.length === 0)
        {
            let fieldValue = currentRecord;
            return fieldValue;
        }

        let nextValue = values.shift();

        return this._traverseRecordValue(currentRecord[nextValue], values);
    }


    private _removeSourceFieldFromRecord(recordToModify: any, value: string): void
    {
        let fields = this._getFieldNameFromValue(value).split('.');

        delete recordToModify[fields[0]];
    }

    private _getIndividualValues(valueString: string): string[]
    {
        return valueString.split(ModifyField.valuesSeperator);
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
        let query = `SELECT ID`;

        for (let i = 0; i < fieldsToQuery.length; i++)
        {
            // if (i > 0)
            // {
            //     query += ', ';
            // }

            query += ', ' + fieldsToQuery[i];
        }

        query += ` FROM ${objectName}`;

        if (this.flags.filter)
        {
            query += this.flags.filter.startsWith('WHERE ') ? ` ${this.flags.filter}` : ` WHERE ${this.flags.filter}`;
        }

        return query;
    }

    private _getFieldNameListFrom(fieldMapping: string): Array<string>
    {
        let fieldNames = [];

        let individualFieldValueMappings = fieldMapping.split(ModifyField.fieldValuePairSeperator);

        individualFieldValueMappings.forEach(individualMapping =>
        {
            let fieldAndValue = individualMapping.split(ModifyField.fieldValueSeperator);

            let fieldName = fieldAndValue[0];
            fieldNames.push(fieldName);

            let values = this._getIndividualValues(fieldAndValue[1]);

            values.forEach(value =>
            {
                if (this._isValueAnotherField(value))
                {
                    fieldNames.push(this._getFieldNameFromValue(value));
                }
            });
        });

        return fieldNames;
    }

    private _getValuesByFieldNameMapFrom(fieldMapping: string): any
    {
        let valuesByFieldNameMap = {};

        let individualFieldValueMappings = fieldMapping.split(ModifyField.fieldValuePairSeperator);

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
