import {IBundlerService} from "./i-bundler-service";
import {IBundlerServiceOptions} from "./i-bundler-service-options";
import {IFileSaver} from "@wessberg/filesaver";
import {IBuildConfig} from "../../build-config/i-build-config";
import {join} from "path";
import {SourceMap} from "rollup";
import {IRollupService} from "../rollup/rollup-service/i-rollup-service";
import {IObserver} from "../../observable/i-observer";

/**
 * A class that can generate a bundle
 */
export class BundlerService implements IBundlerService {

	constructor (private readonly config: IBuildConfig,
							 private readonly rollupService: IRollupService,
							 private readonly fileSaver: IFileSaver) {
	}

	/**
	 * Generates a bundle for an app
	 * @param {IBundlerServiceOptions} options
	 * @returns {IObserver}
	 */
	public generate (options: IBundlerServiceOptions): IObserver {
		let rollupObserver: IObserver|null = null;
		const {outputPaths, bundleName, hash, paths, globals, format, banner, watch, observer, resource, config, ...optionsRest} = options;
		const dir = outputPaths.directory.absolute;

		(async () => {
			rollupObserver = await this.rollupService.generate({
				...optionsRest,
				watch,
				input: paths,
				bundleExternals: true,
				output: {
					dir,
					format,
					banner,
					sourcemap: this.config.useSourcemaps,
					entryFileNames: `[name].${hash}.${bundleName}.${this.config.defaultDestinationScriptExtension}`,
					chunkFileNames: `chunk-[hash].${hash}.${bundleName}.${this.config.defaultDestinationScriptExtension}`,
					globals
				},
				observer: {
					onError: observer.onError,
					onStart: observer.onStart,
					onEnd: async ({outputBundle, cache}): Promise<void> => {
						// Write the generated bundles to disk
						for (const [id, outputFile] of Object.entries(outputBundle)) {

							// Make sure to only write actual chunks to disk
							if (typeof outputFile !== "string" && "code" in outputFile) {
								await this.writeBundleToDisk(id, join(dir, id), outputFile.code, outputFile.map);
							}
						}

						// Resolve the Promise
						observer.onEnd({cache, generatedChunkNames: Object.keys(outputBundle)});
					}
				}
			});
		})();

		// Return a hook to stop observing Rollup
		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (rollupObserver != null) {
					rollupObserver.unobserve();
				}
			}
		};
	}

	/**
	 * Write the given bundle to disk
	 * @param {string} relativePath
	 * @param {string} absolutePath
	 * @param {string} code
	 * @param {SourceMap} map
	 * @returns {Promise<void>}
	 */
	// @ts-ignore
	private async writeBundleToDisk (relativePath: string, absolutePath: string, code: string, map?: SourceMap) {
		// The external reference to add to the code if a map has been generated.
		const sourceMapExtension = map == null ? "" : `\n//# sourceMappingURL=${relativePath}.map`;

		await Promise.all([
			this.fileSaver.save(absolutePath, `${code}${sourceMapExtension}`),
			map != null ? this.fileSaver.save(`${absolutePath}.map`, map.toString()) : Promise.resolve()
		]);
	}
}