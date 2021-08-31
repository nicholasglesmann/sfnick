import MigrationField from "./MigrationField";

export default class MigrationFieldCreatorService
{
    private static readonly MAX_ALLOWED_METADATA_OPERATIONS = 10;

    public static async createMigrationFields(conn, objectsWithoutMigrationField): Promise<Array<Promise<any>>>
    {
        const allMigrationFieldMetadataObjects = MigrationFieldCreatorService._createAllMigrationMetadataJobObjects(objectsWithoutMigrationField);
        let metadataUpsertJobPromises = [];

        for (let metadataUpsertJob of allMigrationFieldMetadataObjects)
        {
            metadataUpsertJobPromises.push(conn.metadata.upsert('CustomField', metadataUpsertJob, (err, results) =>
            {
                if (err)
                {
                    console.error(err);
                    return;
                }

                for (let i = 0; i < results.length; i++)
                {
                    let result = results[i];
                    if (result.success)
                    {
                        console.log(`Successfully upserted the migration field on ${result.fullName}`);
                    }
                }
            }));
        }

        return Promise.all(metadataUpsertJobPromises);
    }

    private static _createAllMigrationMetadataJobObjects(objectsWithoutMigrationField): object[][]
    {
        let migrationJobObjects = [];

        while (objectsWithoutMigrationField.length > 0)
        {
            let batchOfObjects = objectsWithoutMigrationField.splice(0, MigrationFieldCreatorService.MAX_ALLOWED_METADATA_OPERATIONS);
            let batchOfMigrationJobObjects = MigrationFieldCreatorService._createBatchOfMigrationJobObjects(batchOfObjects);
            migrationJobObjects.push(batchOfMigrationJobObjects);
        }

        return migrationJobObjects;
    }

    private static _createBatchOfMigrationJobObjects(objectsWithoutMigrationField): object[]
    {
        return objectsWithoutMigrationField.map(objectName =>
        {
            let migrationField = new MigrationField(objectName);
            return migrationField.toPlainObject();
            // return this._createMigrationMetadataObject(object);
        });
    }

    // private _createMigrationMetadataObject(targetObjectName)
    // {
    //     return {
    //         fullName: `${targetObjectName}.ConfigMigrationId__c`,
    //         description: 'An external id that uses a record\'s Salesforce Id to move records from org to org',
    //         externalId: "true",
    //         label: 'Config Migration Id',
    //         length: 40,
    //         required: false,
    //         type: "Text"
    //     };

    //     // return new MigrationField(targetObjectName);
    // }

}
