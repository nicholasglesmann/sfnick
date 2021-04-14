testDataImports();

void testDataImports()
{
    Boolean isCreating = true;

    Map<String,Integer> recordCounts = isCreating ? getCreatedRecordCounts() : getDeletedRecordCounts();

    for (String objectName : recordCounts.keySet())
    {
        String query = 'SELECT Name FROM ' + objectName;

        List<sObject> records = Database.query(query);

        Integer expectedCount = recordCounts.get(objectName);
        Integer actualCount = records.size();

        System.assertEquals(expectedCount, actualCount, objectName + ' has incorrect count.');

        System.debug(objectName + '- Expected: ' + expectedCount + '  Actual: ' + actualCount);
    }
}
