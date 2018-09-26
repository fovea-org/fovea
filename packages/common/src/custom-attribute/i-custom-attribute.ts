import {IFoveaHost, IFoveaHostConstructor} from "../fovea-host/i-fovea-host";

/*tslint:disable:no-any*/
export interface ICustomAttribute extends IFoveaHost {
}

export interface ICustomAttributeConstructor extends IFoveaHostConstructor {
	new (hostElement: Element): ICustomAttribute;
}