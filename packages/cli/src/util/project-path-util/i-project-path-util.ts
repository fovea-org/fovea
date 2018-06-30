import {IOutputPath} from "../../output-path/i-output-path";
import {IGetOutputPathsForOutputOptions} from "./i-get-output-paths-for-output-options";
import {IOutputResource} from "../../resource/i-resource";

export interface IProjectPathUtil {
	findProjectRoot (configName: string): Promise<string>;
	getProjectRoot (folder: string): string;
	getDirectoryFromProjectRoot (root: string, path: string): string;
	getPathFromProjectRoot (folder: string, path: string): string;
	clearBaseDirectoryFromPath (root: string, entry: string, path: string): string;
	addMarkToPath (path: string, mark: string): string;
	clearFromPath (path: string, clear: string): string;
	getOutputPathsForOutput (options: IGetOutputPathsForOutputOptions): IOutputPath;
	getOutputResourceFromOutputPath (outputPath: IOutputPath, generatedChunkNames: string[]): IOutputResource;
}