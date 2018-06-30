import {IDOMTemplatorOptions} from "./i-dom-templator-options";
import {IDOMTemplatorResult} from "./i-dom-templator-result";

export interface IDOMTemplator {
	template (options: IDOMTemplatorOptions): IDOMTemplatorResult;
}