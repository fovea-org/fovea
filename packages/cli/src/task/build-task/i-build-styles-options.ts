import {IFoveaCliOutputConfig} from "../../fovea-cli-config/i-fovea-cli-config";
import {IBuildTaskExecuteOptions} from "./i-build-task-execute-options";
import {IProject} from "../../service/parser/project-parser/i-project";

export interface IBuildStylesOptions {
	output: IFoveaCliOutputConfig;
	buildTaskOptions: IBuildTaskExecuteOptions;
	project: IProject;
}