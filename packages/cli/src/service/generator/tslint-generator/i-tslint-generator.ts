import {TemplateFile} from "../template-generator/template-file";
import {IGenerator} from "../i-generator";
import {ITslintGeneratorOptions} from "./i-tslint-generator-options";

export interface ITslintGenerator extends IGenerator {
	generate (options: ITslintGeneratorOptions): Promise<TemplateFile[]>;
}