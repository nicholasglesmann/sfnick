import MetadataAttribute from "./MetadataAttribute";
import MetadataFolder from "./MetadataFolder";

export default class MetadataResult
{
    attributes: MetadataAttribute;
    DeveloperName: string;
    FolderName: string;
    Folder: MetadataFolder;
    TableEnumOrId: string;
    NamespacePrefix?: string;
}
