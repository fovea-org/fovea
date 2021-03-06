import {IBundlerService} from "./i-bundler-service";
import {IBundlerServiceOptions} from "./i-bundler-service-options";
import {IFileSaver} from "@wessberg/filesaver";
import {IBuildConfig} from "../../build-config/i-build-config";
import {join} from "path";
import {IRollupService} from "../rollup/rollup-service/i-rollup-service";
import {IObserver} from "../../observable/i-observer";
import {IBundlerServiceWriteBundleToDiskOptions} from "./i-bundler-service-write-bundle-to-disk-options";

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
		const {outputPaths, bundleName, sourcemap, hash, paths, globals, format, banner, footer, intro, outro, watch, observer, resource, config, ...optionsRest} = options;
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
					footer,
					intro,
					outro,
					sourcemap,
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
								await this.writeBundleToDisk({
									relativePath: id,
									absolutePath: join(dir, id),
									code: outputFile.code,
									map: outputFile.map,
									emitSourceMap: sourcemap
								});
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
	 * @param {IBundlerServiceWriteBundleToDiskOptions} options
	 * @returns {Promise<void>}
	 */
	private async writeBundleToDisk ({absolutePath, code, emitSourceMap, map, relativePath}: IBundlerServiceWriteBundleToDiskOptions) {

		// The external reference to add to the code if a map has been generated and should be included
		const sourceMapExtension = map == null || emitSourceMap === false
			? ""
			: `\n` + (emitSourceMap === true
				// Refer to the file containing the map
				? `//# sourceMappingURL=${relativePath}.map`
				// URL-encode the map and inline it
				: `//# sourceMappingURL=${map.toUrl()}`
		);

		await Promise.all([
			this.fileSaver.save(absolutePath, `${code}${sourceMapExtension}`),
			// Don't write the map to disk if it wasn't generated, or if it shouldn't be, or if it is already inlined
			map == null || emitSourceMap !== true ? Promise.resolve () : this.fileSaver.save(`${absolutePath}.map`, map.toString())
		]);
	}
}