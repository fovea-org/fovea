import {IBuildTaskExecuteOptions} from "./i-build-task-execute-options";

export interface IBuildOptions {
	buildTaskOptions: IBuildTaskExecuteOptions;
	clearedDirectories: Set<string>;
}