import {TerminalColor} from "./terminal-color";

export interface ILoggerService {
	logWithSpinner (message: string, color?: TerminalColor): string;
	verboseWithSpinner (message: string): string;
	debugWithSpinner (message: string): string;
	clearSpinner (message?: string): string|undefined;
	log<T> (...messages: T[]): T[];
	logTag<T> (tag: string, ...messages: T[]): T[];
	debug<T> (...messages: T[]): T[];
	debugTag<T> (tag: string, ...messages: T[]): T[];
	verbose<T> (...messages: T[]): T[];
	verboseTag<T> (tag: string, ...messages: T[]): T[];
	setDebug (debug: boolean): void;
	setVerbose (verbose: boolean): void;
}