import MetadataAttribute from "./MetadataAttribute";

export default class SubscriberPackage
{
    attributes: MetadataAttribute;
    NamespacePrefix: string;
    Name: string;

    constructor(subscriberPackage: SubscriberPackage)
    {
        this.attributes = subscriberPackage.attributes;
        this.NamespacePrefix = subscriberPackage.NamespacePrefix;
        this.Name = subscriberPackage.Name;
    }
}
