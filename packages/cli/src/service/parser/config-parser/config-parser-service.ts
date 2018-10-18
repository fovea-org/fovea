import {IConfigParserService} from "./i-config-parser-service";
import {IConfigParserServiceOptions} from "./i-config-parser-service-options";
import {IFoveaCliConfig, IFoveaCliConfigWithAppName} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {IConfigParserServiceEndResult} from "./i-config-parser-service-result";
import chalk from "chalk";
import {ILoggerService} from "../../logger/i-logger-service";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with parsing a fovea-cli.config file
 */
export class ConfigParserService implements IConfigParserService {

	constructor (private readonly config: IBuildConfig,
							 private readonly rollupService: IRollupService,
							 private readonly normalizeFunction: NormalizeFunction<IFoveaCliConfig, Partial<IFoveaCliConfigWithAppName>>,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Parses the config matched by the given options and returns an IFoveaCliConfig
	 * @param {IConfigParserServiceOptions} options
	 * @returns {Observable<Operation<IConfigParserServiceEndResult>>}
	 */
	public parse ({root, path, packageJson, cache}: IConfigParserServiceOptions): Observable<Operation<IConfigParserServiceEndResult>> {

		// Watch for changes to the fovea-cli.config file file and load it when it changes
		return this.fileWatcher.watch(path)
			.pipe(
				tap(() => this.logger.debug(`Found changed ${chalk.magenta(`${this.config.foveaCliConfigName}`)}`)),
				switchMap(() => new Observable<Operation<IConfigParserServiceEndResult>>(subscriber => {

					subscriber.next(OPERATION_START());

					(async () => {
						const {result, cache: newCache} = await this.rollupService.generateWithResult<IFoveaCliConfig>({
							root,
							packageJson,
							cache,
							input: {path}
						});

						this.logger.debug(`Parsed ${chalk.magenta(this.config.foveaCliConfigName)}`);

						subscriber.next({
							kind: OperationKind.END,
							data: {
								// Fill potential holes in the user config with the defaults function
								result: (await this.normalizeFunction({config: this.config, options: result})).config,
								cache: newCache
							}
						});

					})();

					return () => {
					};
				}))
			);
	}
}