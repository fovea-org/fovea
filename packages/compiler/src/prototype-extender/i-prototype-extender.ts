import {IPrototypeExtenderExtendOptions} from "./i-prototype-extender-extend-options";

export interface IPrototypeExtender {
	extend (options: IPrototypeExtenderExtendOptions): void;
}