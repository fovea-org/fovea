import {IAssetParserService} from "./i-asset-parser-service";
import {IFileLoader} from "@wessberg/fileloader";
import {IAssetParserServiceResult} from "./i-asset-parser-service-result";
import {IAssetParserServiceOptions} from "./i-asset-parser-service-options";
import {IObserver} from "../../../observable/i-observer";
import {IWatchService} from "../../watch/i-watch-service";
import {ISubscriber} from "../../../observable/i-subscriber";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";

/**
 * A class that helps with retrieving Buffers of all Assets
 */
export class AssetParserService implements IAssetParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly watchService: IWatchService,
							 private readonly projectPathUtil: IProjectPathUtil) {
	}

	/**
	 * Watches the given directory for assets and generates Buffers from it
	 * @param {IAssetParserServiceOptions} options
	 * @param {ISubscriber<IAssetParserServiceResult>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({project: {root, foveaCliConfig}, watch}: IAssetParserServiceOptions, subscriber: ISubscriber<IAssetParserServiceResult>): IObserver {
		const assetDirectories = foveaCliConfig.asset.path;
		const appIconPath = foveaCliConfig.asset.appIcon.path;

		let assetMap: {[key: string]: Buffer}|null = null;
		let appIcon: Buffer|null = null;
		const clearRoot = (path: string) => this.projectPathUtil.clearBaseDirectoryFromPath(root, foveaCliConfig.entry, path);

		// Watch for changes to the asset directory and read all buffers within it when it changes
		const assetWatcher = this.watchService.watch(assetDirectories, {persistent: watch}, async () => {
			const localAssetMap: {[key: string]: Buffer} = {};
			subscriber.onStart();
			const paths = (await this.fileLoader.getAllInDirectory(assetDirectories, undefined, undefined, true))
			// Don't take the path to the app icon - it requires special treatment
				.filter(path => path !== appIconPath);

			// Read all of the paths except those included in the Set of excluded paths
			await Promise.all(paths.map(async path => localAssetMap[clearRoot(path)] = await this.fileLoader.load(path)));
			assetMap = localAssetMap;

			// Invoke the 'onEnd' subscriber
			if (appIcon != null) {
				subscriber.onEnd({appIcon: {path: appIconPath, buffer: appIcon}, assetMap});
			}

		});

		// Watch for changes to the app icon file and read it when it changes
		const appIconWatcher = this.watchService.watch(appIconPath, {persistent: watch}, async () => {
			subscriber.onStart();
			appIcon = await this.fileLoader.load(appIconPath);

			// Invoke the 'onEnd' subscriber
			if (assetMap != null) {
				subscriber.onEnd({appIcon: {path: clearRoot(appIconPath), buffer: appIcon}, assetMap});
			}

		});

		// Return the observer
		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				assetWatcher.unobserve();
				appIconWatcher.unobserve();
			}
		};
	}
}