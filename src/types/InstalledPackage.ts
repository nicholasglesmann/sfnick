import MetadataAttribute from "./MetadataAttribute";
import SubscriberPackage from "./SubscriberPackage";
import SubscriberPackageVersion from "./SubscriberPackageVersion";

export default class InstalledPackage
{
    attributes: MetadataAttribute;
    subscriberPackage: SubscriberPackage;
    subscriberPackageVersion: SubscriberPackageVersion;

    constructor(installedPackageQueryResult: any)
    {
        this.attributes = installedPackageQueryResult.attributes;
        this.subscriberPackage = new SubscriberPackage(installedPackageQueryResult.SubscriberPackage);
        this.subscriberPackageVersion = new SubscriberPackageVersion(installedPackageQueryResult.SubscriberPackageVersion);
    }

    public getPackageVersion(): string
    {
        return this.subscriberPackageVersion.getInstalledPackageVersion();
    }

    public getName(): string
    {
        return this.subscriberPackage.Name;
    }

    public getNamespacePrefix(): string
    {
        return this.subscriberPackage.NamespacePrefix;
    }
}
