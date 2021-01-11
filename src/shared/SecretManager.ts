import { ConfigFile } from '@salesforce/core/lib/config/configFile';
import { Crypto } from '@salesforce/core/lib/crypto';

export default class SecretManager extends ConfigFile<ConfigFile.Options>
{
    public async getSecret(key: string)
    {
        const crypto = await Crypto.create();
        const encryptedSecret = this.get(key) as string;
        return crypto.decrypt(encryptedSecret)
    }

    public async setSecret(key: string, value: string)
    {
        const crypto = await Crypto.create();
        const encryptedSecret = crypto.encrypt(value);
        this.set(key, encryptedSecret);
        await this.write();
    }

    public static async init(): Promise<SecretManager>
    {
        let config = {
            filename: 'fonteva-secrets.json',
            isGlobal: true
        };
        let secretManager = await SecretManager.create(config);
        return secretManager;
    }
}
