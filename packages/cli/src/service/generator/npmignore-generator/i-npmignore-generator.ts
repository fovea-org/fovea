import {TemplateFile} from "../template-generator/template-file";
import {IGenerator} from "../i-generator";
import {INpmignoreGeneratorOptions} from "./i-npmignore-generator-options";

export interface INpmignoreGenerator extends IGenerator {
	generate (options: INpmignoreGeneratorOptions): Promise<TemplateFile[]>;
}