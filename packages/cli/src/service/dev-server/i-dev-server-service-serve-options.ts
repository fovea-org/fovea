import {FallbackIndex} from "./fallback-index";
import {LogLevel} from "./log-level/log-level";

export interface IDevServerServiceServeOptions {
	host: string;
	port: number;
	root: string;
	fallbackIndex: FallbackIndex;
	logLevel: LogLevel;
	cacheControl: string;
	liveReload: {
		activated: boolean;
		path: string;
	};
}