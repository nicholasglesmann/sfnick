import RegisteredObject from "./RegisteredObject";

export default class RegisteredApp
{
    public shortDescription: string;

    public owner: string;

    public namespace: string;

    public name: string;

    public isEnabled: boolean;

    public isManaged: boolean;

    public installClass: string;

    public description: string;

    public registeredObjects: RegisteredObject[];

    static fromJson()
    {

    }
}
