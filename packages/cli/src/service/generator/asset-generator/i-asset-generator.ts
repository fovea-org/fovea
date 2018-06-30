import {IGenerator} from "../i-generator";
import {TemplateFile} from "../template-generator/template-file";

export interface IAssetGenerator extends IGenerator {
	generate (): Promise<TemplateFile[]>;
}