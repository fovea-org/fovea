import {IManifestJsonParserService} from "./i-manifest-json-parser-service";
import {IManifestJsonParserServiceOptions} from "./i-manifest-json-parser-service-options";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {ILoggerService} from "../../logger/i-logger-service";
import chalk from "chalk";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IManifestJsonParserServiceEndResult} from "./i-manifest-json-parser-service-result";
import {IResource} from "../../../resource/i-resource";
import {IManifestJson} from "../../../manifest-json/i-manifest-json";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with parsing a manifest.json file
 */
export class ManifestJsonParserService implements IManifestJsonParserService {

	constructor (private readonly rollupService: IRollupService,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly logger: ILoggerService,
							 private readonly config: IBuildConfig) {
	}

	/**
	 * Parses the config matched by the given options and returns an IManifestJson
	 * @param {IManifestJsonParserServiceOptions} options
	 * @returns {Observable<Operation<IManifestJsonParserServiceEndResult>>}
	 */
	public parse ({paths, resource, additionalEnvironmentVariables, root, tsconfig, packageJson, cache, tag}: IManifestJsonParserServiceOptions): Observable<Operation<IManifestJsonParserServiceEndResult>> {
		this.logger.verboseTag(tag, `Generating ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)}...`);

		// Watch for changes to the manifest.json.ts file and compile it when it changes
		return this.fileWatcher.watch(Object.values(paths))
			.pipe(
				tap(() => this.logger.debugTag(tag, `Found new ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)}`)),
				switchMap(() => new Observable<Operation<IManifestJsonParserServiceEndResult>>(subscriber => {

					subscriber.next(OPERATION_START());

					this.rollupService.generateWithResult<(config: IResource) => IManifestJson>({
						additionalEnvironmentVariables,
						root,
						tsconfig,
						cache,
						packageJson,
						input: paths
					})
						.then(({result, cache: newCache}) => {
							this.logger.verboseTag(tag, `Built ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)}!`);

							subscriber.next({
								kind: OperationKind.END,
								data: {
									result: result(resource),
									cache: newCache
								}
							});
						});

					return () => {
					};
				}))
			);
	}
}