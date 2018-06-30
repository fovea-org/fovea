import {IFormatter} from "./i-formatter";
import prettier, {Options} from "prettier";
import format from "html-format";
import {IFormatterOptions} from "./i-formatter-options";

/**
 * A Formatter that can format Source code.
 * Will use Prettier where it can and fall back to using the "html-format" library
 * for HTML which isn't yet supported in prettier
 */
export class Formatter implements IFormatter {

	/**
	 * Formats the given source code through either prettier or html-format, depending
	 * on the source language
	 * @param {string} source
	 * @param {IFormatterOptions} options
	 * @returns {string}
	 */
	public format (source: string, options?: IFormatterOptions): string {
		// If the parser is 'html', use html-format
		if (options != null && options.parser === "html") {
			return format(
				source,
				options.useTabs === true ? "\t".repeat(options.tabWidth != null ? options.tabWidth : 1) : " ",
				options.printWidth
			);
		}

		// Otherwise, use prettier
		return prettier.format(source, <Options> options);
	}

}