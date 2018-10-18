import {IAssetParserService} from "./i-asset-parser-service";
import {IFileLoader} from "@wessberg/fileloader";
import {IAssetParserServiceOptions} from "./i-asset-parser-service-options";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";
import {combineLatest, Observable} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {ILoggerService} from "../../logger/i-logger-service";
import chalk from "chalk";
import {ensureArray} from "../../../util/iterable/iterable-util";
import {Operation, OPERATION_START, OperationKind} from "../../../operation/operation";
import {IAssetParserServiceAppIconEndResult, IAssetParserServiceAssetEndResult, IAssetParserServiceEndResult} from "./i-asset-parser-service-result";
import {IFileWatcher} from "../../watch/i-file-watcher";

/**
 * A class that helps with retrieving Buffers of all Assets
 */
export class AssetParserService implements IAssetParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly fileWatcher: IFileWatcher,
							 private readonly projectPathUtil: IProjectPathUtil,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Watches the given directory for assets and generates Buffers from it
	 * @param {IAssetParserServiceOptions} options
	 * @returns {Observable<Operation<IAssetParserServiceEndResult>>}
	 */
	public parse ({project: {root, foveaCliConfig}}: IAssetParserServiceOptions): Observable<Operation<IAssetParserServiceEndResult>> {
		const assetDirectories = ensureArray(foveaCliConfig.asset.path);
		const appIconPath = foveaCliConfig.asset.appIcon.path;

		this.logger.verbose(`Locating assets inside ${assetDirectories.length === 1 ? "directory" : "directories"}: ${chalk.magenta(assetDirectories.join(", "))}, and app icon at path: ${chalk.magenta(appIconPath)}...`);

		return combineLatest(
			// Watch all assets and load all of them when any of them changes
			this.fileWatcher.watch(assetDirectories)
				.pipe(
					tap(() => this.logger.debug(`Found changed assets`)),
					switchMap(() => new Observable<Operation<IAssetParserServiceAssetEndResult>>(subscriber => {

						subscriber.next(OPERATION_START());

						this.logger.debug(`Loading changed assets...`);

						(async () => {
							const localAssetMap: { [key: string]: Buffer } = {};

							const paths = (<string[]> [].concat.apply([], await Promise.all(assetDirectories.map(async assetDirectory => await this.fileLoader.getAllInDirectory(assetDirectory, undefined, undefined, true)))))
							// Don't take the path to the app icon - it requires special treatment
								.filter(path => path !== appIconPath);

							// Read all of the paths except those included in the Set of excluded paths
							await Promise.all(paths.map(async path => localAssetMap[this.projectPathUtil.clearBaseDirectoryFromPath(root, foveaCliConfig.entry, path)] = await this.fileLoader.load(path)));

							this.logger.debug(`Loaded changed assets!`);

							subscriber.next({
								kind: OperationKind.END,
								data: localAssetMap
							});
						})();

						return () => {
						};
					}))
				),

			// When the app icon path changes, load the file on that path
			this.fileWatcher.watch(appIconPath)
				.pipe(
					tap(() => this.logger.debug(`Found changed app icon`)),
					switchMap(() => new Observable<Operation<IAssetParserServiceAppIconEndResult>>(subscriber => {

						subscriber.next(OPERATION_START());

						this.logger.debug(`Loading app icon...`);

						this.fileLoader.load(appIconPath)
							.then(buffer => {

								this.logger.debug(`Loaded app icon!`);

								subscriber.next({
									kind: OperationKind.END,
									data: {
										path: this.projectPathUtil.clearBaseDirectoryFromPath(root, foveaCliConfig.entry, appIconPath),
										buffer
									}
								});
							});

						return () => {
						};
					})))
		)
			.pipe(
				// Combine the Observables for the app icon and the assets
				map(([assetResult, appIconResult]) => {
					if (assetResult.kind === OperationKind.START || appIconResult.kind === OperationKind.START) {
						return OPERATION_START();
					}

					this.logger.verbose(`Successfully read assets and app icon!`);

					return {
						kind: <OperationKind.END> OperationKind.END,
						data: {
							assetMap: assetResult.data,
							appIcon: appIconResult.data
						}
					};
				}));
	}
}