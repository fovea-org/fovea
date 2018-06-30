import {IGenerator} from "../i-generator";
import {TemplateFile} from "../template-generator/template-file";
import {IFoveaCliConfigGeneratorOptions} from "./i-fovea-cli-config-generator-options";

export interface IFoveaCliConfigGenerator extends IGenerator {
	generate (options: IFoveaCliConfigGeneratorOptions): Promise<TemplateFile[]>;
}