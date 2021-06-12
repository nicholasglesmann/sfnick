import { Connection, Org } from '@salesforce/core';
import { Record } from 'jsforce';
import InstalledPackage from '../types/InstalledPackage';

export default class OrgService
{
    static async getConnFrom(username: string): Promise<Connection>
    {
        const org = await Org.create({ aliasOrUsername: username });
        const conn = org.getConnection();
        await org.refreshAuth();
        return conn;
    }

    static async queryInstalledPackages(conn: Connection): Promise<InstalledPackage[]>
    {
        return new Promise((resolve, reject) =>
        {
            conn.tooling.sobject('InstalledSubscriberPackage').find({}, [
                "SubscriberPackage.Name",
                "SubscriberPackage.NamespacePrefix",
                "SubscriberPackageVersion.MajorVersion",
                "SubscriberPackageVersion.MinorVersion",
                "SubscriberPackageVersion.PatchVersion"
            ])
            .execute({}, (err, installedPackageQueryResults) =>
            {
                if (err) { reject(err); }

                let installedPackages = installedPackageQueryResults.map(installedPackageQueryResult => {
                    return new InstalledPackage(installedPackageQueryResult);
                })

                resolve(installedPackages);
            });
        });
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
                .run({ autoFetch: true, maxFetch: 1000000 });
        });
    }
}
