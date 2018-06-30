import {IManifestJsonParserService} from "./i-manifest-json-parser-service";
import {IManifestJsonParserServiceOptions} from "./i-manifest-json-parser-service-options";
import {IManifestJson} from "../../../manifest-json/i-manifest-json";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IResource} from "../../../resource/i-resource";
import {IWatchService} from "../../watch/i-watch-service";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

/**
 * A class that helps with parsing a manifest.json file
 */
export class ManifestJsonParserService implements IManifestJsonParserService {

	constructor (private readonly rollupService: IRollupService,
							 private readonly watchService: IWatchService) {
	}

	/**
	 * Parses the config matched by the given options and returns an IManifestJson
	 * @param {IManifestJsonParserServiceOptions} options
	 * @param {ISubscriber<IRollupServiceGenerateWithResultResult<IManifestJson>>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({paths, resource, additionalEnvironmentVariables, root, tsconfig, packageJson, cache, watch}: IManifestJsonParserServiceOptions, subscriber: ISubscriber<IRollupServiceGenerateWithResultResult<IManifestJson>>): IObserver {

		// Watch for changes to the manifest.json.ts file and compile it when it changes
		const watcher = this.watchService.watch(Object.values(paths), {persistent: watch}, async () => {
			subscriber.onStart();
			const {result, cache: newCache} = (await this.rollupService.generateWithResult<(config: IResource) => IManifestJson>({
				additionalEnvironmentVariables,
				root,
				tsconfig,
				cache,
				packageJson,
				input: paths
			}));

			subscriber.onEnd({
				result: result(resource),
				cache: newCache
			});
		});

		// Return the observer
		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				watcher.unobserve();
			}
		};
	}
}