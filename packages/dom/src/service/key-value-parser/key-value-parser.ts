import {IKeyValueParser} from "./i-key-value-parser";
import {Parser, regex, seq, string} from "parsimmon";
import {IKeyValueParserConfig} from "./i-key-value-parser-config";
import {Json} from "@fovea/common";

/**
 * A service that can parse values provided to attributes
 */
export class KeyValueParser implements IKeyValueParser {

	/**
	 * Matches the raw content to ignore
	 * @type {Parser<string>}
	 */
	private readonly ignore: Parser<string> = regex(/\s*/m);
	/**
	 * Matches the raw content representing a newline
	 * @type {Parser<string>}
	 */
	private readonly newline: Parser<string> = regex(/\n*/);
	/**
	 * Matches the raw content representing an assignment
	 * @type {Parser<string>}
	 */
	private readonly assignment1: Parser<string> = regex(new RegExp(`([^${this.config.assignmentToken}])+`, "i"));
	/**
	 * Matches the raw content representing an assignment
	 * @type {Parser<string>}
	 */
	private readonly assignment2: Parser<string> = string(this.config.assignmentToken);
	/**
	 * Matches the raw content representing a separator
	 * @type {Parser<string>}
	 */
	private readonly separator1: Parser<string> = regex(new RegExp(`([^${this.config.separatorToken}])+`, "i"));
	/**
	 * Matches the raw content representing a separator
	 * @type {Parser<string>}
	 */
	private readonly separator2: Parser<string> = regex(new RegExp(`(${this.config.separatorToken})?`));

	constructor (private readonly config: IKeyValueParserConfig) {
	}

	/**
	 * Parses the given value
	 * @param {string} content
	 * @returns {string|T}
	 */
	public parse<T> (content: string): string|T {
		const startOfLine = this.getLexeme(this.newline);

		// Parse the property
		const property = seq(
			this.getLexeme(this.assignment1), this.getLexeme(this.assignment2)
		).map(v => v[0]);

		// Parse the property value
		const propertyValue = seq(
			this.getLexeme(this.separator1), this.getLexeme(this.separator2)
		).map(v => v[0]);

		const cfs = startOfLine.then(
			seq(property, propertyValue).many()
		).map(v => {
			return v.reduce((r: { [key: string]: Json }, [key, value]) => {
				r[key] = value;
				return r;
			}, {});
		});

		const result = cfs.parse(content);
		if (!result.status) return content;
		return <T> result.value;
	}

	/**
	 * Parses the given value
	 * @param {Parser<string>} value
	 */
	private getLexeme (value: Parser<string>): Parser<string> {
		return value.skip(this.ignore);
	}

}