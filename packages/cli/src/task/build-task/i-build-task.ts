import {ITask} from "../i-task";
import {IBuildTaskExecuteOptions} from "./i-build-task-execute-options";

export interface IBuildTask extends ITask {
	execute (options: IBuildTaskExecuteOptions): Promise<void>;
}

export declare type BuildTaskWrapper = () => IBuildTask;