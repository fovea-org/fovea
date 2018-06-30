import {ICommand} from "../i-command";

export enum CreateCommandShortOptionKind {
	VERBOSE = "v",
	DEBUG = "d",
	INSTALL = "i",
	YARN = "y",
	TEMPLATE = "t"
}

export enum CreateCommandLongOptionKind {
	VERBOSE = "verbose",
	DEBUG = "debug",
	INSTALL = "install",
	YARN = "yarn",
	TEMPLATE = "template"
}

export interface ICreateCommandOptions {
	[CreateCommandLongOptionKind.VERBOSE]: boolean;
	[CreateCommandLongOptionKind.DEBUG]: boolean;
	[CreateCommandLongOptionKind.INSTALL]: boolean;
	[CreateCommandLongOptionKind.YARN]: boolean;
	[CreateCommandLongOptionKind.TEMPLATE]: "standard";
}

export interface ICreateCommand extends ICommand {
	onCommand (args: string[], options: ICreateCommandOptions): Promise<void>;
}