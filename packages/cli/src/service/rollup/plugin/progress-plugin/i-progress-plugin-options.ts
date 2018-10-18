import {TerminalColor} from "../../../logger/terminal-color";

export interface IProgressPluginLogger {
	color: TerminalColor;
	log (output: string): void;
	clear (): void;
}

export interface IProgressPluginOptions {
	root: string;
	logger: IProgressPluginLogger;
}