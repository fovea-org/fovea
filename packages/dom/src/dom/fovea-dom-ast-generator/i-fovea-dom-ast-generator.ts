import {IFoveaDOMAstGeneratorOptions} from "./i-fovea-dom-ast-generator-options";
import {IFoveaDOMAstGeneratorGenerateResult} from "./i-fovea-dom-ast-generator-generate-result";

export interface IFoveaDOMAstGenerator {
	generate (options: IFoveaDOMAstGeneratorOptions): IFoveaDOMAstGeneratorGenerateResult;
}