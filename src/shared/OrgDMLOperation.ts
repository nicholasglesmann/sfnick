import { Connection } from '@salesforce/core';
import { Record } from 'jsforce';

export enum OperationType {
    insert,
    upsert,
    update,
    delete
}

export class OrgDMLOperation
{
    public conn: Connection;

    public records: Array<any>;

    public sObjectName: string

    public constructor(records: Array<Record>, sObjectName: string, conn: Connection)
    {
        this.records = records;
        this.sObjectName = sObjectName;
        this.conn = conn;
    }


    public constructOperationFunction(operationType: OperationType)
    {
        let jsForceOperationFunctionName = OperationType[operationType];

        return () => {
            return new Promise((resolve, reject) =>
            {
                this.conn.sobject(this.sObjectName)[jsForceOperationFunctionName]
                (
                    this.records,
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
