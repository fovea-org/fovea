import {IWatchService} from "./i-watch-service";
import {WatchCallback} from "./watch-callback";
import {FSWatcher, watch} from "chokidar";
import {IObserver} from "../../observable/i-observer";
import {IThrottleUtil} from "../../util/throttle-util/i-throttle-util";
import {IWatchServiceWatchOptions} from "./i-watch-service-watch-options";

/**
 * A class that helps with watching files and directories
 */
export class WatchService implements IWatchService {
	/**
	 * A Map between file watchers and the Set of callbacks to invoke when the files change
	 * @type {Map<string, Set<WatchCallback>>}
	 */
	private readonly watchMap: Map<string, Set<WatchCallback>> = new Map();
	/**
	 * A Map between keys to paths and file watchers bound from Chokidar
	 * @type {Map<string, FSWatcher>}
	 */
	private readonly keyToWatcherMap: Map<string, FSWatcher> = new Map();
	/**
	 * The Set of all paths that has changed
	 * @type {Set<string>}
	 */
	private readonly changedPaths: Set<string> = new Set();

	/**
	 * How much to throttle the watch handler
	 * @type {number}
	 */
	private readonly THROTTLE_TIME: number = 300;

	constructor (private readonly throttleUtil: IThrottleUtil) {}

	/**
	 * Watches the given path and invokes the given observer when it changes
	 * @param {string[]|string} paths
	 * @param {IWatchServiceWatchOptions} options
	 * @param {WatchCallback} callback
	 * @returns {IObserver}
	 */
	public watch (paths: string[]|string, {persistent}: IWatchServiceWatchOptions, callback: WatchCallback): IObserver {

		// Add the callback to the Set of callbacks to invoke when the given path changes
		this.watchPaths(paths, callback);
		const key = this.stringifyPaths(paths);
		const callbackSet = this.watchMap.get(key)!;

		// If no file watcher is associated with the paths, add one
		if (!this.isPathsWatched(paths)) {
			const invokeCallbacks = () => {
				if (callbackSet != null) {
					callbackSet.forEach(cb => cb());
				}
			};

			// Watch the destination directory for changes and invoke the observer when it changes
			const watchHandler = (event: "add"|"unlink"|"change") => {
				this.changedPaths.add(key);
				switch (event) {
					case "add":
					case "change":
					case "unlink":
						// Throttle calling the watch handler
						this.throttleUtil.throttle(invokeCallbacks, this.THROTTLE_TIME, invokeCallbacks);
						break;
				}
			};
			const watcher = watch(paths, {persistent}).on("all", watchHandler);

			// Bind it to the Map
			this.keyToWatcherMap.set(key, watcher);
		}

		// Otherwise, if no new file watcher should be attached, and the paths has changed before, invoke the callback immediately
		else if (this.changedPaths.has(key)) {
			callback();
		}

		const self = this;

		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				// Remove the callback from the Set
				callbackSet.delete(callback);

				// If there are no more callbacks for the file, close it and remove the paths from the Map!
				if (callbackSet.size === 0) {
					self.watchMap.delete(key);

					// Check if a watcher exists for the key
					const watcher = self.keyToWatcherMap.get(key);
					if (watcher != null) {

						// Close the file watcher unless it has already been closed
						if (Array.from(self.keyToWatcherMap.values()).includes(watcher)) {
							watcher.close();
							watcher.removeAllListeners();
						}
						// Remove it from the Map
						self.keyToWatcherMap.delete(key);
					}
				}
			}
		};
	}

	/**
	 * Stringifies the given paths
	 * @param {string[] | string} paths
	 * @returns {string}
	 */
	private stringifyPaths (paths: string[]|string): string {
		return JSON.stringify(Array.isArray(paths) ? paths : [paths]);
	}

	/**
	 * Watches the given paths with the given callback
	 * @param {string[] | string} paths
	 * @param {WatchCallback} callback
	 */
	private watchPaths (paths: string[]|string, callback: WatchCallback): void {
		const key = this.stringifyPaths(paths);
		let existingSet = this.watchMap.get(key);
		if (existingSet == null) {
			existingSet = new Set();
			this.watchMap.set(key, existingSet);
		}
		existingSet.add(callback);
	}

	/**
	 * Returns true if there is a file watcher for the given paths
	 * @param {string[] | string} paths
	 * @returns {boolean}
	 */
	private isPathsWatched (paths: string[]|string): boolean {
		const key = this.stringifyPaths(paths);
		return this.keyToWatcherMap.has(key);
	}

}