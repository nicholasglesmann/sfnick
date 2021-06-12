import MetadataAttribute from "./MetadataAttribute";

export default class SubscriberPackageVersion
{
    attributes: MetadataAttribute;
    MajorVersion: number;
    MinorVersion: number;
    PatchVersion: number;

    constructor(subscriberPackageVersion: SubscriberPackageVersion)
    {
        this.attributes = subscriberPackageVersion.attributes;
        this.MajorVersion = subscriberPackageVersion.MajorVersion;
        this.MinorVersion = subscriberPackageVersion.MinorVersion;
        this.PatchVersion = subscriberPackageVersion.PatchVersion;
    }

        public getInstalledPackageVersion(): string
    {
        return `${this.MajorVersion}.${this.MinorVersion}.${this.PatchVersion}`;
    }
}
