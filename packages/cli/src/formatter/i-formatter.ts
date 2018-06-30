import {IFormatterOptions} from "./i-formatter-options";

export interface IFormatter {
	format (source: string, options?: IFormatterOptions): string;
}