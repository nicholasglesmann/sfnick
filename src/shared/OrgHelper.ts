import { Connection, Org } from '@salesforce/core';

export default class OrgHelper
{
    static async getConnFrom(username: string): Promise<Connection>
    {
        const org = await Org.create({ aliasOrUsername: username });
        const conn = org.getConnection();
        await org.refreshAuth();
        return conn;
    }
}
