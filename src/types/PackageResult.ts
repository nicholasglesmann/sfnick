import MetadataAttribute from "./MetadataAttribute";
import SubscriberPackage from "./SubscriberPackage";
import SubscriberPackageVersion from "./SubscriberPackageVersion";

export default class InstalledPackageResult
{
    attributes: MetadataAttribute;
    SubscriberPackage: SubscriberPackage;
    SubscriberPackageVersion: SubscriberPackageVersion;
}
