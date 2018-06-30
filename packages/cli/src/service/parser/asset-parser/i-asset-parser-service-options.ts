import {IProject} from "../project-parser/i-project";

export interface IAssetParserServiceOptions {
	project: IProject;
	watch: boolean;
}