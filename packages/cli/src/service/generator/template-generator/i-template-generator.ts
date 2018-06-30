import {ICreateTaskExecuteOptions} from "../../../task/create-task/i-create-task-execute-options";
import {TemplateFile} from "./template-file";
import {IGenerator} from "../i-generator";

export interface ITemplateGenerator extends IGenerator {
	generate (options: ICreateTaskExecuteOptions): Promise<TemplateFile[]>;
}