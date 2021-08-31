import { Connection } from '@salesforce/core';
import { Record } from 'jsforce';
const pLimit = require('p-limit');
import cli from 'cli-ux'
import { performance } from 'perf_hooks';
import Stylize from './ui/Stylize';
import { OperationType, OrgDMLOperation } from './OrgDMLOperation';

export { OperationType };

export class OrgDMLOperator
{
    public conn: Connection;

    public operationType: OperationType;

    public records: Array<any>;

    public sObjectName: string;

    public limit: number = 10;

    public batchSize: number = 200;

    // private _operationFunctions = {
    //     [OperationType.insert]: this._constructInsertOperation,
    //     [OperationType.upsert]: this._constructUpsertOperation,
    //     [OperationType.update]: this._constructUpdateOperation,
    //     [OperationType.delete]: this._constructDeleteOperation
    // }

    public constructor(conn: Connection, sObjectName: string)
    {
        this.conn = conn;
        this.sObjectName = sObjectName;
    }

    public async run(operationType: OperationType, records: Array<any>): Promise<any>
    {
        let operationStartTime = performance.now();

        this.operationType = operationType;
        this.records = records;

        cli.action.start(this._getOperationStartMessage());

        return new Promise(async (resolve, reject) =>
        {
            const limit = pLimit(this.limit); // Limit concurrent API connections

            try
            {
                let operationPromises = this._constructOperationPromiseArray(limit, this.conn);

                (async () =>
                {
                    const result = await Promise.all(operationPromises);

                    cli.action.stop(this._getOperationStopMessage(operationStartTime));

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


    private _getOperationStartMessage(): string
    {
        let operationTypeLabel = this._getOperationTypeLabel(this.operationType);
        let sObjectNameLabel = Stylize.fonBlue(this.sObjectName);
        let recordCountLabel = Stylize.bold(this.records.length.toString());

        return `Running ${operationTypeLabel} operation on ${recordCountLabel} ${sObjectNameLabel} records`;
    }


    private _getOperationTypeLabel(operationType: OperationType): string
    {
        let label = OperationType[operationType];

        return operationType === OperationType.delete ? Stylize.danger(label) : Stylize.success(label);
    }


    private _getOperationStopMessage(operationStartTime): string
    {
        let operationEndTime = performance.now();
        let operationTotalTime = Math.floor((operationEndTime - operationStartTime) / 1000);

        return `finished in ${Stylize.bold(operationTotalTime)} seconds!\n`;
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
        let orgDMLOperation = new OrgDMLOperation(chunkOfRecords, sObjectName, conn);
        return orgDMLOperation.constructOperationFunction(this.operationType);

        // return this._operationFunctions[this.operationType].call(this, chunkOfRecords, sObjectName, conn);
    }


    private _removeChunkOfRecordsFromArray(): Array<any>
    {
        if (this.operationType === OperationType.delete) // delete operations only need the record Id, not the whole object
        {
            return this.records.splice(0, this.batchSize)
                .map(record => record.Id);
        }

        return this.records.splice(0, this.batchSize);
    }


    // private _constructDMLOperation(records: Array<Record>, sObjectName: string, conn: Connection, operationTypeLabel: string)
    // {
    //     return () => {
    //         return new Promise((resolve, reject) =>
    //         {
    //             conn.sobject(sObjectName)[operationTypeLabel]
    //             (
    //                 records,
    //                 async (err, responses: any) =>
    //                 {
    //                     if (err)
    //                     {
    //                         reject(err);
    //                     }

    //                     this._logIndividualRecordProblems(responses);

    //                     resolve(responses);
    //                 }
    //             );
    //         });
    //     }
    // }


    // private _constructInsertOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    // {
    //     let orgDMLOperation = new OrgDMLOperation(records, sObjectName, conn);
    //     return orgDMLOperation.constructOperationFunction(OperationType.insert);

    //     // return () => {
    //     //     return new Promise((resolve, reject) =>
    //     //     {
    //     //         conn.sobject(sObjectName)['insert']
    //     //         (
    //     //             records,
    //     //             async (err, responses: any) =>
    //     //             {
    //     //                 if (err)
    //     //                 {
    //     //                     reject(err);
    //     //                 }

    //     //                 this._logIndividualRecordProblems(responses);

    //     //                 resolve(responses);
    //     //             }
    //     //         );
    //     //     });
    //     // }
    // }


    // private _constructUpsertOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    // {
    //     throw new Error('Upsert operation not implimented!');
    // }


    // private _constructUpdateOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    // {
    //     return () => {
    //         return new Promise((resolve, reject) =>
    //         {
    //             conn.sobject(sObjectName)
    //                 .update(
    //                     records,
    //                     async (err, responses: any) =>
    //                     {
    //                         if (err)
    //                         {
    //                             reject(err);
    //                         }

    //                         this._logIndividualRecordProblems(responses);

    //                         resolve(responses);
    //                     }
    //                 );
    //         });
    //     }
    // }


    // private _constructDeleteOperation(records: Array<Record>, sObjectName: string, conn: Connection)
    // {
    //     return () => {
    //         return new Promise((resolve, reject) =>
    //         {
    //             conn.sobject(sObjectName)
    //                 .delete(
    //                     records,
    //                     async (err, responses: any) =>
    //                     {
    //                         if (err)
    //                         {
    //                             reject(err);
    //                         }

    //                         this._logIndividualRecordProblems(responses);

    //                         resolve(responses);
    //                     }
    //                 );
    //         });
    //     }
    // }


    // private _logIndividualRecordProblems(responses: any)
    // {
    //     responses?.forEach(response => {

    //         if (!response.success)
    //         {
    //             response?.errors.forEach(error => {

    //                 console.error(`Error: ${error.message}`);
    //             });
    //         }
    //     });
    // }
}
