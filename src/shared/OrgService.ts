import { Connection, Org } from '@salesforce/core';
import { Record } from 'jsforce';
import InstalledPackage from '../types/InstalledPackage';
import DataMoverService from './DataMoverService';
import cli from 'cli-ux'
import { performance } from 'perf_hooks';
import Stylize from '../shared/ui/Stylize';

export default class OrgService
{
    static async getConnFromUsername(username: string): Promise<Connection>
    {
        const org = await Org.create({ aliasOrUsername: username });
        const conn = org.getConnection();
        await org.refreshAuth();
        return conn;
    }

    static async getConnFromOrg(org: Org): Promise<Connection>
    {
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


    static async queryRecords(query: string, conn: Connection, noLog?: boolean): Promise<Array<Record>>
    {
        let objectName = DataMoverService.getObjectNameFromQuery(query);

        if (!noLog)
        {
            // cli.action.start(`Querying for ${Stylize.fonBlue(objectName)} records using query: \n${Stylize.query(query)}`);
            cli.action.start(`${Stylize.bold('Running query:')} ${Stylize.query(query)}`);
        }

        let queryStartTime = performance.now();

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
                    let queryEndTime = performance.now();
                    let queryTotalTime = Math.floor((queryEndTime - queryStartTime) / 1000);

                    if (!noLog)
                    {
                        cli.action.stop(`\nQuery found ${Stylize.bold(records.length)} ${Stylize.fonBlue(objectName)} records in ${Stylize.bold(queryTotalTime)} seconds!\n`);
                    }

                    resolve(records);
                })
                .on('error', function (error: any)
                {
                    reject(error);
                })
                .run({ autoFetch: true, maxFetch: 1000000 });
        });
    }


    static async queryRecordCounts(query: string, conn: Connection): Promise<number>
    {
        let objectName = DataMoverService.getObjectNameFromQuery(query);

        return conn.sobject(objectName).count();
    }
}
