import {SourceMap, OutputOptions} from "rollup";

export interface IBundlerServiceWriteBundleToDiskOptions {
	relativePath: string;
	absolutePath: string;
	code: string;
	emitSourceMap: OutputOptions["sourcemap"];
	map?: SourceMap;
}