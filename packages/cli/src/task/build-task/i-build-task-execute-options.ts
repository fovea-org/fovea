import {ITaskExecuteOptions} from "../i-task-execute-options";
import {IBuildCommandOptions} from "../../command/build-command/i-build-command";

export interface IBuildTaskExecuteOptions extends ITaskExecuteOptions, IBuildCommandOptions {
}