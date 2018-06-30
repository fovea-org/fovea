import {TemplateFile} from "./template-generator/template-file";
// tslint:disable:no-any

export interface IGenerator {
	generate (...args: any[]): Promise<TemplateFile[]>;
}