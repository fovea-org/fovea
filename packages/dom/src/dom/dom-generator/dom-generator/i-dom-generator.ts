import {IDOMGeneratorOptions} from "./i-dom-generator-options";
import {IDOMGeneratorResult} from "./i-dom-generator-result";

export interface IDOMGenerator {
	generate (options: IDOMGeneratorOptions): IDOMGeneratorResult;
}