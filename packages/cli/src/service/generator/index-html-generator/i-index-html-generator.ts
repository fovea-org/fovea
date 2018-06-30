import {IGenerator} from "../i-generator";
import {TemplateFile} from "../template-generator/template-file";

export interface IIndexHtmlGenerator extends IGenerator {
	generate (): Promise<TemplateFile[]>;
}