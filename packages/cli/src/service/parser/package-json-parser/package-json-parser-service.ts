import {IPackageJsonParserService} from "./i-package-json-parser-service";
import {IPackageJsonParserServiceOptions} from "./i-package-json-parser-service-options";
import {IFileLoader} from "@wessberg/fileloader";
import {IPackageJson} from "../../../package-json/i-package-json";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {PackageJsonUserOptions} from "../../../package-json/package-json-user-options";
import {IPackageJsonNormalizeFunctionConfig} from "../../../package-json/i-package-json-normalize-function-config";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import chalk from "chalk";
import {ILoggerService} from "../../logger/i-logger-service";
import {IPackageJsonParserServiceEndResult} from "./i-package-json-parser-service-result";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with parsing a package.json file
 */
export class PackageJsonParserService implements IPackageJsonParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly config: IBuildConfig,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly normalizeFunction: NormalizeFunction<IPackageJson, PackageJsonUserOptions, IPackageJsonNormalizeFunctionConfig>,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Parses the config matched by the given options and returns a package.json file
	 * @param {IPackageJsonParserServiceOptions} options
	 * @returns {Observable<Operation<IPackageJsonParserServiceEndResult>>}
	 */
	public parse ({path}: IPackageJsonParserServiceOptions): Observable<Operation<IPackageJsonParserServiceEndResult>> {

		// Watch for changes to the package.json file and load it when it changes
		return this.fileWatcher.watch(path)
			.pipe(
				tap(() => this.logger.debug(`Found changed ${chalk.magenta(`${this.config.packageFileName}`)}`)),
				switchMap(() => new Observable<Operation<IPackageJsonParserServiceEndResult>>(subscriber => {

					subscriber.next(OPERATION_START());

					(async () => {
						const userPackage: IPackageJson = JSON.parse((await this.fileLoader.load(path)).toString());

						this.logger.debug(`Parsed ${chalk.magenta(this.config.packageFileName)}`);

						// Fill potential holes in the user-provided package.json file with the normalize function
						subscriber.next({
							kind: OperationKind.END,
							data: (await this.normalizeFunction({config: {...this.config, skipDependencies: true}, options: userPackage})).config
						});
					})();

					return () => {
					};
				}))
			);
	}
}