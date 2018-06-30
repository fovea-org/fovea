import {TemplateFile} from "../template-generator/template-file";
import {IGenerator} from "../i-generator";
import {IGitignoreGeneratorOptions} from "./i-gitignore-generator-options";

export interface IGitignoreGenerator extends IGenerator {
	generate (options: IGitignoreGeneratorOptions): Promise<TemplateFile[]>;
}