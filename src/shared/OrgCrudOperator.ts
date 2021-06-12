import { Connection } from '@salesforce/core';
import { Record } from 'jsforce';
const pLimit = require('p-limit');

export enum OperationType {
    Create,
    Upsert,
    Update,
    Delete
}

export class OrgCrudOperator
{
    public conn: Connection;

    public operationType: OperationType;

    public records: Array<any>;

    public sObjectName: string;

    public limit: number = 10;

    private _operationFunctions = {
        [OperationType.Create]: this._constructCreateOperation,
        [OperationType.Upsert]: this._constructUpsertOperation,
        [OperationType.Update]: this._constructUpdateOperation,
        [OperationType.Delete]: this._constructDeleteOperation
    }

    public constructor(conn: Connection, sObjectName: string)
    {
        this.conn = conn;
        this.sObjectName = sObjectName;
    }

    public async run(operationType: OperationType, records: Array<any>): Promise<any>
    {
        this.operationType = operationType;
        this.records = records;

        return new Promise(async (resolve, reject) =>
        {
            const limit = pLimit(this.limit); // Limit concurrent API connections

            try
            {
                let operationPromises = this._constructOperationPromiseArray(limit, this.conn);

                (async () => {
                    const result = await Promise.all(operationPromises);
                    resolve(result);
                })();
            }
            catch (err)
            {
                console.log(err);
                reject(err);
            }
        });
    }


    private _constructOperationPromiseArray(limit: any, conn: Connection)
    {
        let operationPromises = [];

        while (this.records.length > 0)
        {
            operationPromises.push(this._constructOperationPromise(this.sObjectName, limit, conn));
        }

        return operationPromises;
    }


    private _constructOperationPromise(sObjectName: string, limit: any, conn: Connection)
    {
        let chunkOfRecords = this._removeChunkOfRecordsFromArray();

        let operationFunction = this._constructOperationFunction(chunkOfRecords, sObjectName, conn);

        return limit(operationFunction);
    }


    private _constructOperationFunction(chunkOfRecords: Array<Record>, sObjectName: string, conn: Connection)
    {
        return this._operationFunctions[this.operationType].call(this, chunkOfRecords, sObjectName, conn);
    }


    private _removeChunkOfRecordsFromArray(): Array<any>
    {
        if (this.operationType === OperationType.Delete)
        {
            return this.records.splice(0, 200)
                .map(record => record.Id);
        }

        return this.records.splice(0, 200);
    }


    private _constructCreateOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    {
        return () => {
            return new Promise((resolve, reject) =>
            {
                conn.sobject(sObjectName)
                    .insert(
                        records,
                        async (err, responses: any) =>
                        {
                            if (err)
                            {
                                reject(err);
                            }

                            this._logIndividualRecordProblems(responses);

                            resolve(responses);
                        }
                    );
            });
        }
    }


    private _constructUpsertOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    {
        throw new Error('Upsert operation not implimented!');
    }


    private _constructUpdateOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    {
        return () => {
            return new Promise((resolve, reject) =>
            {
                conn.sobject(sObjectName)
                    .update(
                        records,
                        async (err, responses: any) =>
                        {
                            if (err)
                            {
                                reject(err);
                            }

                            this._logIndividualRecordProblems(responses);

                            resolve(responses);
                        }
                    );
            });
        }
    }


    private _constructDeleteOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    {
        return () => {
            return new Promise((resolve, reject) =>
            {
                conn.sobject(sObjectName)
                    .delete(
                        records,
                        async (err, responses: any) =>
                        {
                            if (err)
                            {
                                reject(err);
                            }

                            this._logIndividualRecordProblems(responses);

                            resolve(responses);
                        }
                    );
            });
        }
    }


    private _logIndividualRecordProblems(responses: any)
    {
        responses?.forEach(response => {

            if (!response.success)
            {
                response?.errors.forEach(error => {

                    console.error(`Error: ${error.message}`);
                });
            }
        });
    }
}
