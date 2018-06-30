import {ICreateCommandOptions} from "../../command/create-command/i-create-command";
import {ITaskExecuteOptions} from "../i-task-execute-options";

export interface ICreateTaskExecuteOptions extends ITaskExecuteOptions, ICreateCommandOptions {
	folder: string;
}