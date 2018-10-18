import {IProjectParserService} from "./i-project-parser-service";
import {IProjectParserServiceOptions} from "./i-project-parser-service-options";
import {IConfigParserService} from "../config-parser/i-config-parser-service";
import {IPackageJsonParserService} from "../package-json-parser/i-package-json-parser-service";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";
import {IHasherService} from "../../hasher/i-hasher-service";
import {from, Observable, of} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {ILoggerService} from "../../logger/i-logger-service";
import chalk from "chalk";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IProjectParserServiceEndResult} from "./i-project-parser-service-result";

/**
 * A class that helps with retrieving things that are relevant to the configuration of a Fovea project
 */
export class ProjectParserService implements IProjectParserService {

	constructor (private readonly configParser: IConfigParserService,
							 private readonly packageJsonParser: IPackageJsonParserService,
							 private readonly projectPathUtil: IProjectPathUtil,
							 private readonly hasherService: IHasherService,
							 private readonly logger: ILoggerService,
							 private readonly config: IBuildConfig) {
	}

	/**
	 * Retrieves the IFoveaCliConfig for a project as well as its' root
	 * @param {IProjectParserServiceOptions} options
	 * @returns {Observable<Operation<IProjectParserServiceEndResult>>}
	 */
	public parse ({config}: IProjectParserServiceOptions): Observable<Operation<IProjectParserServiceEndResult>> {
		this.logger.verbose(`Finding project root...`);

		// Compute a new hash
		const hash = this.hasherService.generate();

		// Find the project root and then observe the package.json and fovea-cli.config files within that directory
		return from(this.projectPathUtil.findProjectRoot(config))
			.pipe(
				tap(root => this.logger.debug(`Found project root: ${chalk.magenta(root)}`)),
				tap(() => this.logger.verbose(`Finding and parsing ${chalk.magenta(this.config.foveaCliConfigName)} and ${chalk.magenta(this.config.packageFileName)} files...`)),

				switchMap(root => this.packageJsonParser.parse({path: this.projectPathUtil.getPathFromProjectRoot(root, this.config.packageFileName)})
					.pipe(
						switchMap((packageJsonResult): Observable<Operation<IProjectParserServiceEndResult>> => {
							if (packageJsonResult.kind === OperationKind.START) {
								return of(OPERATION_START());
							}

							return this.configParser.parse({packageJson: packageJsonResult.data, root, path: this.projectPathUtil.getPathFromProjectRoot(root, config)})
								.pipe(
									map(foveaCliConfigResult => {
										if (foveaCliConfigResult.kind === OperationKind.START) {
											return OPERATION_START();
										}

										this.logger.verbose(`Successfully parsed ${chalk.magenta(this.config.foveaCliConfigName)} and ${chalk.magenta(this.config.packageFileName)} files!`);

										return {
											kind: <OperationKind.END> OperationKind.END,
											data: {
												root,
												hash,
												packageJson: packageJsonResult.data,
												foveaCliConfig: foveaCliConfigResult.data.result
											}
										};

									}));
						}))
				)
			);
	}
}