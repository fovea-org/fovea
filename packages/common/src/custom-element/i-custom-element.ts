import {IFoveaHost, IFoveaHostConstructor} from "../fovea-host/i-fovea-host";

export interface ICustomElement extends HTMLElement, IFoveaHost {
}

export interface ICustomElementConstructor extends IFoveaHostConstructor {
	new (): ICustomElement;
}