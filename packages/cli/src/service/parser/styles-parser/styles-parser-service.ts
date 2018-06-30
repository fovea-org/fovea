import {IStylesParserService} from "./i-styles-parser-service";
import {IFileLoader} from "@wessberg/fileloader";
import {IFoveaStyles} from "@fovea/style";
import {IStylesParserServiceResult} from "./i-styles-parser-service-result";
import {IStylesParserServiceOptions} from "./i-styles-parser-service-options";
import {IObserver} from "../../../observable/i-observer";
import {IWatchService} from "../../watch/i-watch-service";
import {ISubscriber} from "../../../observable/i-subscriber";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";

/**
 * A class that helps with parsing some styles
 */
export class StylesParserService implements IStylesParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly foveaStyles: IFoveaStyles,
							 private readonly watchService: IWatchService,
							 private readonly projectPathUtil: IProjectPathUtil) {
	}

	/**
	 * Sets the given options and subscribes to the given styles path
	 * @param {IStylesParserServiceOptions} options
	 * @param {ISubscriber<IStylesParserServiceResult>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({postCSSPlugins, watch, foveaCliConfig, root, production}: IStylesParserServiceOptions, subscriber: ISubscriber<IStylesParserServiceResult>): IObserver {

		/**
		 * The generated theme variables, if any
		 * @param {object|null}
		 */
		let themeVariables: { [key: string]: string }|null = null;

		/**
		 * The generated global styles, if any
		 * @type {string|null}
		 */
		let globalStyles: string|null = null;

		// Resolve the path to the theme styles
		const themeStylesPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.style.theme);
		// Resolve the path to the global styles
		const globalStylesPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.style.global);

		// Watch all files within the 'style' directory
		const watcher = this.watchService.watch(foveaCliConfig.style.directory, {persistent: watch}, async () => {
			subscriber.onStart();

			// Take all variables
			themeVariables = await this.foveaStyles.takeVariables({
				file: themeStylesPath,
				template: (await this.fileLoader.load(themeStylesPath)).toString()
			});

			// Take all variables
			globalStyles = (await this.foveaStyles.generate({
				file: globalStylesPath,
				template: (await this.fileLoader.load(globalStylesPath)).toString(),
				production, postCSSPlugins
			})).staticCSS;

			subscriber.onEnd({themeVariables, globalStyles});
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