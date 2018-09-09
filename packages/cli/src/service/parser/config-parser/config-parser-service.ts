import {IConfigParserService} from "./i-config-parser-service";
import {IConfigParserServiceOptions} from "./i-config-parser-service-options";
import {IFoveaCliConfig, IFoveaCliConfigWithAppName} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IWatchService} from "../../watch/i-watch-service";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

/**
 * A class that helps with parsing a fovea-cli.config file
 */
export class ConfigParserService implements IConfigParserService {

	constructor (private readonly config: IBuildConfig,
							 private readonly rollupService: IRollupService,
							 private readonly normalizeFunction: NormalizeFunction<IFoveaCliConfig, Partial<IFoveaCliConfigWithAppName>>,
							 private readonly watchService: IWatchService) {
	}

	/**
	 * Parses the config matched by the given options and returns an IFoveaCliConfig
	 * @param {IConfigParserServiceOptions} options
	 * @param {ISubscriber<IRollupServiceGenerateWithResultResult<IFoveaCliConfig>>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({root, path, packageJson, cache, watch}: IConfigParserServiceOptions, subscriber: ISubscriber<IRollupServiceGenerateWithResultResult<IFoveaCliConfig>>): IObserver {

		// Watch for changes to the fovea-cli.config file file and load it when it changes
		const watcher = this.watchService.watch(path, {persistent: watch}, async () => {
			// Invoke the 'onStart()' handler
			subscriber.onStart();

			const {result, cache: newCache} = await this.rollupService.generateWithResult<IFoveaCliConfig>({
				root,
				packageJson,
				cache,
				input: {path}
			});

			// Fill potential holes in the user config with the defaults function and invoke the 'onEnd' subscriber
			subscriber.onEnd({
				result: (await this.normalizeFunction({config: this.config, options: result})).config,
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