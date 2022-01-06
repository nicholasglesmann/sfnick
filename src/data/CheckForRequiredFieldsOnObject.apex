String objectName = 'OrderApi__Subscription__c';

Type objectType = Type.forName(objectName);
SObject objectInstance = (SObject) objectType.newInstance();

Schema.DescribeSObjectResult objectDescribe = OrderApi__Subscription__c.sObjectType.getDescribe();

Map<String,Schema.SObjectField> fieldsByFieldName = objectDescribe.fields.getMap();

for(String fieldName : fieldsByFieldName.keySet())
{
    Schema.SObjectField field = fieldsByFieldName.get(fieldName);
    Schema.DescribeFieldResult fieldDescribe = field.getDescribe();

    Boolean isFieldRequired  = !fieldDescribe.isNillable();

    Boolean isFormula = fieldDescribe.isCalculated();

    Schema.DisplayType fieldType = fieldDescribe.getType();

    if (isFieldRequired && !isFormula)
    {
        System.debug ('Field: ' + fieldName + ' of type ' + fieldType + ' is required.');
    }
}
