import {IStylesParserService} from "./i-styles-parser-service";
import {IFileLoader} from "@wessberg/fileloader";
import {IFoveaStyles} from "@fovea/style";
import {IStylesParserServiceOptions} from "./i-styles-parser-service-options";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import chalk from "chalk";
import {ILoggerService} from "../../logger/i-logger-service";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IStylesParserServiceEndResult} from "./i-styles-parser-service-result";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with parsing some styles
 */
export class StylesParserService implements IStylesParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly foveaStyles: IFoveaStyles,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly projectPathUtil: IProjectPathUtil,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Sets the given options and subscribes to the given styles path
	 * @param {IStylesParserServiceOptions} options
	 * @returns {Observable<Operation<IStylesParserServiceEndResult>>}
	 */
	public parse ({postCSSPlugins, tag, foveaCliConfig, root, production}: IStylesParserServiceOptions): Observable<Operation<IStylesParserServiceEndResult>> {

		// Resolve the path to the theme styles
		const themeStylesPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.style.theme);
		// Resolve the path to the global styles
		const globalStylesPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.style.global);

		this.logger.verboseTag(tag, `Parsing global styles at ${chalk.magenta(globalStylesPath)}, and theme variables at ${chalk.magenta(themeStylesPath)}`);

		return this.fileWatcher.watch(foveaCliConfig.style.directory)
			.pipe(
				tap(() => this.logger.debugTag(tag, `Found changed styles`)),
				switchMap(() => new Observable<Operation<IStylesParserServiceEndResult>>(subscriber => {

					subscriber.next(OPERATION_START());

					(async () => {

						this.logger.debugTag(tag, `Computing theme variables...`);

						const themeVariables = await this.foveaStyles.takeVariables({
							file: themeStylesPath,
							template: (await this.fileLoader.load(themeStylesPath)).toString()
						});

						this.logger.debugTag(tag, `Computed theme variables!`);
						this.logger.debugTag(tag, `Computing global styles...`);

						const globalStyles = (await this.foveaStyles.generate({
							file: globalStylesPath,
							template: (await this.fileLoader.load(globalStylesPath)).toString(),
							production, postCSSPlugins
						})).staticCSS;

						this.logger.debugTag(tag, `Computed global styles!`);

						this.logger.verboseTag(tag, `Successfully parsed global styles and theme variables!`);
						subscriber.next({
							kind: OperationKind.END,
							data: {
								themeVariables,
								globalStyles
							}
						});
					})();

					return () => {
					};
				}))
			);
	}
}