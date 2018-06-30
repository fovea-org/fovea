import {ITask} from "../i-task";
import {ICreateTaskExecuteOptions} from "./i-create-task-execute-options";

export interface ICreateTask extends ITask {
	execute (options: ICreateTaskExecuteOptions): Promise<void>;
}

export declare type CreateTaskWrapper = () => ICreateTask;