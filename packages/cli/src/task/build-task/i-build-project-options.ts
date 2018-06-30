import {IProject} from "../../service/parser/project-parser/i-project";
import {IBuildOptions} from "./i-build-options";

export interface IBuildProjectOptions extends IBuildOptions {
	project: IProject;
}