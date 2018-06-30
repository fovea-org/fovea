import {IFoveaCliOutputConfig} from "../../fovea-cli-config/i-fovea-cli-config";
import {IOutputPath} from "../../output-path/i-output-path";
import {IOutputResource} from "../../resource/i-resource";
import {IBuildTaskExecuteOptions} from "./i-build-task-execute-options";

export interface IServeOptions {
	output: IFoveaCliOutputConfig;
	buildTaskOptions: IBuildTaskExecuteOptions;
	outputPaths (): IOutputPath;
	resource (): IOutputResource;
	index: number;
}