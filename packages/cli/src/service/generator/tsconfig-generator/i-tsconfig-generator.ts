import {TemplateFile} from "../template-generator/template-file";
import {IGenerator} from "../i-generator";
import {ITsconfigGeneratorOptions} from "./i-tsconfig-generator-options";

export interface ITsconfigGenerator extends IGenerator {
	generate (options: ITsconfigGeneratorOptions): Promise<TemplateFile[]>;
}