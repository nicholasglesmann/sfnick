import { Connection, Org } from '@salesforce/core';
import { Record } from 'jsforce';

export default class OrgService
{
    static async getConnFrom(username: string): Promise<Connection>
    {
        const org = await Org.create({ aliasOrUsername: username });
        const conn = org.getConnection();
        await org.refreshAuth();
        return conn;
    }


    static async queryRecords(query: string, conn: Connection): Promise<Array<Record>>
    {
        return new Promise((resolve, reject) =>
        {
            let records = [];

            conn.query(query)
                .on('record', function (record: any)
                {
                    records.push(<Record>record);
                })
                .on('end', function ()
                {
                    resolve(records);
                })
                .on('error', function (error: any)
                {
                    reject(error);
                })
                .run({ autoFetch: true, maxFetch: 50000 });
        });
    }
}
