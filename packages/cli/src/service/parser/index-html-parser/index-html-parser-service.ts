import {IIndexHtmlParserService} from "./i-index-html-parser-service";
import {IIndexHtmlParserServiceOptions} from "./i-index-html-parser-service-options";
import {IRollupService} from "../../rollup/rollup-service/i-rollup-service";
import {IIndexHtmlOptions} from "../../../index-html/i-index-html-options";
import {Observable} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {ILoggerService} from "../../logger/i-logger-service";
import {IBuildConfig} from "../../../build-config/i-build-config";
import chalk from "chalk";
import {IIndexHtmlParserServiceEndResult} from "./i-index-html-parser-service-result";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with parsing a index.html file
 */
export class IndexHtmlParserService implements IIndexHtmlParserService {

	constructor (private readonly rollupService: IRollupService,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly logger: ILoggerService,
							 private readonly config: IBuildConfig) {
	}

	/**
	 * Parses the config matched by the given options and returns an IManifestJson
	 * @param {IIndexHtmlParserServiceOptions} options
	 * @returns {Observable<Operation<IIndexHtmlParserServiceEndResult>>}
	 */
	public parse ({paths, resource, additionalEnvironmentVariables, cwd, tsconfig, packageJson, globalStyles, polyfillContent, polyfillUrl, cache, tag}: IIndexHtmlParserServiceOptions): Observable<Operation<IIndexHtmlParserServiceEndResult>> {

		this.logger.verboseTag(tag, `Generating ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)}...`);

		// Watch for changes to the index.html.ts file and compile it when it changes
		return this.fileWatcher.watch(Object.values(paths))
			.pipe(
				tap(() => this.logger.debugTag(tag, `Found new ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)}`)),
				switchMap(() => new Observable<Operation<IIndexHtmlParserServiceEndResult>>(subscriber => {

					subscriber.next(OPERATION_START());

					this.rollupService.generateWithResult<(options: IIndexHtmlOptions) => string>({
						additionalEnvironmentVariables,
						cwd,
						browserslist: false,
						cache,
						tsconfig,
						packageJson,
						input: paths
					})
						.then(({result, cache: newCache}) => {
							this.logger.verboseTag(tag, `Built ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)}!`);

							subscriber.next({
								kind: OperationKind.END,
								data: {
									result: result({resource, globalStyles, polyfillContent, polyfillUrl}),
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