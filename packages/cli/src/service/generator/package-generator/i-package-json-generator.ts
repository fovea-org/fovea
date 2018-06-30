import {TemplateFile} from "../template-generator/template-file";
import {IGenerator} from "../i-generator";
import {IPackageJsonGeneratorOptions} from "./i-package-json-generator-options";

export interface IPackageJsonGenerator extends IGenerator {
	generate (options: IPackageJsonGeneratorOptions): Promise<TemplateFile[]>;
}