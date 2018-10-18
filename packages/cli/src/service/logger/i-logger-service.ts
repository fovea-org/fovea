import {TerminalColor} from "./terminal-color";

export interface ILoggerService {
	readonly LOG_COLOR: TerminalColor;
	readonly VERBOSE_COLOR: TerminalColor;
	readonly DEBUG_COLOR: TerminalColor;

	logWithSpinner (message: string, color?: TerminalColor): string;
	verboseWithSpinner (message: string): string;
	debugWithSpinner (message: string): string;
	clearSpinner (message?: string): string|undefined;
	log<T> (...messages: T[]): T[];
	logTag<T> (tag: string, ...messages: T[]): T[];
	logMessageForTag<T> (message: T, tag?: string): T;
	debug<T> (...messages: T[]): T[];
	debugTag<T> (tag: string, ...messages: T[]): T[];
	verbose<T> (...messages: T[]): T[];
	verboseTag<T> (tag: string, ...messages: T[]): T[];
	setDebug (debug: boolean): void;
	setVerbose (verbose: boolean): void;

	logOnOneLine<T> (...messages: T[]): T[];
	logTagOnOneLine<T> (tag: string, ...messages: T[]): T[];
	verboseOnOneLine<T> (...messages: T[]): T[];
	verboseTagOnOneLine<T> (tag: string, ...messages: T[]): T[];
	debugOnOneLine<T> (...messages: T[]): T[];
	debugTagOnOneLine<T> (tag: string, ...messages: T[]): T[];
	clearLastLine (): void;
}