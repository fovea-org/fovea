import {WatchCallback} from "./watch-callback";
import {IObserver} from "../../observable/i-observer";
import {IWatchServiceWatchOptions} from "./i-watch-service-watch-options";

export interface IWatchService {
	watch (paths: string[]|string, options: IWatchServiceWatchOptions, observer: WatchCallback): IObserver;
}