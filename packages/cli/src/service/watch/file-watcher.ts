import {IFileWatcher} from "./i-file-watcher";
import {FSWatcher} from "chokidar";
import {MaybeArray} from "@fovea/common";
import {ensureArray} from "../../util/iterable/iterable-util";
import {fromEvent, Observable, Subscription} from "rxjs";
import {filter, map, throttleTime} from "rxjs/operators";

/**
 * The Chokidar event names that are relevant here
 * @type {string[]}
 */
const RELEVANT_CHOKIDAR_EVENT_NAMES: ("add"|"addDir"|"change"|"unlink")[] = ["add", "addDir", "change", "unlink"];

/**
 * Something that can watch files
 */
export class FileWatcher implements IFileWatcher {

	/**
	 * How much to throttle the watch handler
	 * @type {number}
	 */
	private readonly THROTTLE_TIME: number = 300;

	/**
	 * Adds the given paths to the watcher
	 * @param {string | string[]} paths
	 * @returns {Observable<string>}
	 */
	public watch (paths: MaybeArray<string>): Observable<string> {
		return new Observable<string>(subscriber => {
			const watcher = new FSWatcher({persistent: true});

			let subscription: Subscription|undefined = fromEvent(watcher, "all")
				.pipe(throttleTime(this.THROTTLE_TIME))
				.pipe(filter(([event]) => this.isRelevantEvent(event)))
				// @ts-ignore
				.pipe(map(([, file]) => file))
				.pipe(map(file => subscriber.next(file)))
				.subscribe();

			ensureArray(paths)
				.forEach(path => watcher.add(path));

			return () => {
				ensureArray(paths)
					.forEach(path => watcher.unwatch(path));

				watcher.close();

				if (subscription != null) {
					subscription.unsubscribe();
					subscription = undefined;
				}
			};
		});
	}

	/**
	 * Returns true if the given event is relevant
	 * @param {string[]} event
	 * @returns {boolean}
	 */
	private isRelevantEvent (event: typeof RELEVANT_CHOKIDAR_EVENT_NAMES[keyof typeof RELEVANT_CHOKIDAR_EVENT_NAMES]): boolean {
		return RELEVANT_CHOKIDAR_EVENT_NAMES.some(name => name === event);
	}
}