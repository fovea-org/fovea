import {ICompressPluginOptions} from "./i-compress-plugin-options";
import {OutputBundle, Plugin} from "rollup";
import {IGenerateOptions} from "./i-generate-options";
import {dirname, join} from "path";
import {Buffer} from "buffer";

// The extension for SourceMaps
const MAP_EXTENSION = ".map";

/**
 * A Rollup plugin that can compress the generated rollup chunks
 * @param {ICompressPluginOptions} options
 */
// @ts-ignore
export function compressRollupPlugin ({compressor, ...compressionAlgorithmOptions}: ICompressPluginOptions): Plugin {

	return {
		name: "Compress Rollup Plugin",

		/**
		 * Invoked when a bundle has been generated
		 */
		async generateBundle (outputOptions: IGenerateOptions, bundle: OutputBundle): Promise<void> {
			const destinationDirectory = outputOptions.dir != null ? outputOptions.dir : outputOptions.file != null ? dirname(outputOptions.file) : outputOptions.dest != null ? dirname(outputOptions.dest) : undefined;
			// Do nothing if no destination directory could be decided
			if (destinationDirectory == null) return;

			await Promise.all(Object.entries(bundle).map(async ([chunkName, chunk]) => {
				const codeBuffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk instanceof Buffer ? chunk : Buffer.from(chunk.code);
				const mapBuffer = typeof chunk === "string" || chunk instanceof Buffer || chunk.map == null ? null : Buffer.from(chunk.map.toString());
				return await Promise.all([
					compressor.compressAndWrite(codeBuffer, join(destinationDirectory, chunkName), compressionAlgorithmOptions),
					mapBuffer == null ? Promise.resolve() : compressor.compressAndWrite(mapBuffer, join(destinationDirectory, `${chunkName}${MAP_EXTENSION}`), compressionAlgorithmOptions)
				]);
			}));
		}

	};
}