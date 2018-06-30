import {IIndexHtmlParserService} from "./i-index-html-parser-service";
import {IIndexHtmlParserServiceOptions} from "./i-index-html-parser-service-options";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IIndexHtmlOptions} from "../../../index-html/i-index-html-options";
import {IObserver} from "../../../observable/i-observer";
import {IWatchService} from "../../watch/i-watch-service";
import {ISubscriber} from "../../../observable/i-subscriber";

/**
 * A class that helps with parsing a index.html file
 */
export class IndexHtmlParserService implements IIndexHtmlParserService {

	constructor (private readonly rollupService: IRollupService,
							 private readonly watchService: IWatchService) {
	}

	/**
	 * Parses the config matched by the given options and returns an IManifestJson
	 * @param {IIndexHtmlParserServiceOptions} options
	 * @param {ISubscriber<IRollupServiceGenerateWithResultResult<string>>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({paths, resource, additionalEnvironmentVariables, root, tsconfig, packageJson, globalStyles, polyfillContent, polyfillUrl, cache, watch}: IIndexHtmlParserServiceOptions, subscriber: ISubscriber<IRollupServiceGenerateWithResultResult<string>>): IObserver {

		// Watch for changes to the index.html.ts file and compile it when it changes
		const watcher = this.watchService.watch(Object.values(paths), {persistent: watch}, async () => {
			subscriber.onStart();
			const {result, cache: newCache} = (await this.rollupService.generateWithResult<(options: IIndexHtmlOptions) => string>({
				additionalEnvironmentVariables,
				root,
				cache,
				tsconfig,
				packageJson,
				input: paths
			}));

			subscriber.onEnd({
				result: result({resource, globalStyles, polyfillContent, polyfillUrl}),
				cache: newCache
			});
		});

		// Return an observer
		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				watcher.unobserve();
			}
		};
	}
}