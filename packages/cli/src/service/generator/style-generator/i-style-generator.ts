import {IGenerator} from "../i-generator";
import {TemplateFile} from "../template-generator/template-file";

export interface IStyleGenerator extends IGenerator {
	generate (): Promise<TemplateFile[]>;
}