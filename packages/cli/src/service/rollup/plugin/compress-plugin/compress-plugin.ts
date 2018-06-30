import {ICompressPluginOptions} from "./i-compress-plugin-options";
import {Plugin, SourceDescription} from "rollup";
import {IGenerateOptions} from "./i-generate-options";
import {dirname, join} from "path";

// The extension for SourceMaps
const MAP_EXTENSION = ".map";

/**
 * A Rollup plugin that can compress the generated rollup chunks
 * @param {ICompressPluginOptions} options
 */
// @ts-ignore
export function compressRollupPlugin ({compressor}: ICompressPluginOptions): Plugin {

	return {
		name: "Compress Rollup Plugin",

		/**
		 * Called when a chunk has been generated
		 * @param {IGenerateOptions} outputOptions
		 * @param {SourceDescription} source
		 * @returns {Promise<void>}
		 */
		async ongenerate (outputOptions: IGenerateOptions, {code, map}: SourceDescription): Promise<void> {
			const destinationDirectory = outputOptions.dir != null ? outputOptions.dir : outputOptions.file != null ? dirname(outputOptions.file) : outputOptions.dest != null ? dirname(outputOptions.dest) : undefined;
			// Do nothing if no destination directory could be decided
			if (destinationDirectory == null) return;

			await Promise.all([
				compressor.compressAndWrite(Buffer.from(code), join(destinationDirectory, outputOptions.id)),
				map != null ? compressor.compressAndWrite(Buffer.from(code), join(destinationDirectory, `${outputOptions.id}${MAP_EXTENSION}`)) : Promise.resolve()
			]);
		}

	};
}