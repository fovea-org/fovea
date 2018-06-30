import {ICommand} from "../i-command";

export enum BuildCommandShortOptionKind {
	VERBOSE = "v",
	WATCH = "w",
	SERVE = "s",
	LIVE_RELOAD = "r",
	DEBUG = "d",
	PRODUCTION = "p",
	STATS = "s",
	CONFIG = "c",
	NO_CACHE = "n"
}

export enum BuildCommandLongOptionKind {
	VERBOSE = "verbose",
	WATCH = "watch",
	SERVE = "serve",
	LIVE_RELOAD = "reload",
	DEBUG = "debug",
	PRODUCTION = "production",
	STATS = "stats",
	CONFIG = "config",
	NO_CACHE = "no_cache"
}

export interface IBuildCommandOptions {
	[BuildCommandLongOptionKind.VERBOSE]: boolean;
	[BuildCommandLongOptionKind.WATCH]: boolean;
	[BuildCommandLongOptionKind.SERVE]: boolean;
	[BuildCommandLongOptionKind.LIVE_RELOAD]: boolean;
	[BuildCommandLongOptionKind.DEBUG]: boolean;
	[BuildCommandLongOptionKind.NO_CACHE]: boolean;
	[BuildCommandLongOptionKind.PRODUCTION]: boolean;
	[BuildCommandLongOptionKind.STATS]: boolean;
	[BuildCommandLongOptionKind.CONFIG]: string;
}

export interface IBuildCommand extends ICommand {
	onCommand (args: string[], options: IBuildCommandOptions): Promise<void>;
}