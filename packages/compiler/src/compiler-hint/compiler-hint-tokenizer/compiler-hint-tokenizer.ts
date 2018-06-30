import {ICompilerHintTokenizer} from "./i-compiler-hint-tokenizer";
import {CompilerHintOperatorToken, CompilerHintSplitted, IEndHint, IHint, IIfHint} from "../compiler-hint/compiler-hint";
import {CompilerHintToken} from "../compiler-hint-token/compiler-hint-token";
import {IFoveaStats} from "../../stats/i-fovea-stats";
import {Json} from "@fovea/common";
import {removeWhitespace} from "@wessberg/stringutil";

/**
 * A Tokenizer for CompilerHints
 */
export class CompilerHintTokenizer implements ICompilerHintTokenizer {

	/**
	 * A RegExp for matching an IF statement
	 * @type {RegExp}
	 */
	private readonly ifRegExp = /\/\*#\s*IF\s+([^*]+)\*\//;
	/**
	 * A RegExp for matching an END statement
	 * @type {RegExp}
	 */
	private readonly endRegExp = /\/\*#\s*END\s+(\w+)\s+([^*]+)\*\//;

	/**
	 * A RegExp for splitting an expression
	 * @type {RegExp}
	 */
	private readonly splitterRegExp = /(\|\||&&|!)/;

	/**
	 * Returns true if the given string is an IF statement
	 * @param {string} str
	 * @returns {boolean}
	 */
	public isIfStatement (str: string): boolean {
		return this.ifRegExp.test(str);
	}

	/**
	 * Returns true if the given string is an END statement
	 * @param {string} str
	 * @returns {number}
	 */
	public isEndStatement (str: string): boolean {
		return this.endRegExp.test(str);
	}

	/**
	 * Takes the expression of an IF statement
	 * @param {string} str
	 * @returns {string}
	 */
	public takeIfExpression (str: string): string {
		if (!this.isIfStatement(str)) throw new TypeError(`Could not take the IF expression for the provided string: It wasn't an IF statement!`);
		const match = str.match(this.ifRegExp)!;
		return removeWhitespace(match[1], false);
	}

	/**
	 * Takes the hint of an END Statement
	 * @param {string} str
	 * @returns {string}
	 */
	public takeEndHint (str: string): [string, string] {
		if (!this.isEndStatement(str)) throw new TypeError(`Could not take the END hint for the provided string: It wasn't an END statement!`);
		const match = str.match(this.endRegExp)!;
		return [removeWhitespace(match[1], false), removeWhitespace(match[2], false)];
	}

	/**
	 * Creates an 'IF' hint
	 * @param {number} pos
	 * @param {number} end
	 * @param {CompilerHintSplitted} expression
	 * @param {IEndHint} endHint
	 * @param {string} code
	 * @returns {IIfHint}
	 */
	public createIfHint (pos: number, end: number, expression: CompilerHintSplitted, endHint: IEndHint, code: string): IIfHint {
		return {
			...this.createHint(pos, end, code),
			kind: CompilerHintToken.IF,
			endHint,
			expression,
			evaluate (stats: IFoveaStats): boolean {
				const [first] = expression;
				if (first == null) return false;

				// If there is only one, it is as easy as checking if looking it up in the stats is strictly equal to true
				else if (expression.length === 1 && typeof first === "string") {
					return stats[first] === true;
				}

				// Otherwise, replace all keys by their truth values and compute it
				else {

					return new Function(`return ${
						expression
							.map(part => typeof part === "string" ? stats[part] : part.operator)
							.join("")
						}`)();
				}
			}
		};
	}

	/**
	 * Creates an 'END' hint
	 * @param {number} pos
	 * @param {number} end
	 * @param {CompilerHintToken} hint
	 * @param {string} code
	 * @returns {IEndHint}
	 */
	public createEndHint (pos: number, end: number, hint: CompilerHintToken, code: string): IEndHint {
		return {
			...this.createHint(pos, end, code),
			kind: CompilerHintToken.END,
			hint
		};
	}

	/**
	 * Returns the next index of an IfStatement
	 * @param {string} str
	 * @param {number} from
	 * @returns {[number, string]}
	 */
	public nextIfStatement (str: string, from: number): [number, string] {
		return this.indexOf(str, this.ifRegExp, from);
	}

	/**
	 * Returns the next index of an IfStatement
	 * @param {string} str
	 * @param {number} from
	 * @returns {[number, string]}
	 */
	public nextEndStatement (str: string, from: number): [number, string] {
		return this.indexOf(str, this.endRegExp, from);
	}

	/**
	 * Splits the given string by compiler hint operators
	 * @param {string} str
	 * @returns {CompilerHintSplitted}
	 */
	public splitByOperators (str: string): CompilerHintSplitted {
		// Split the string and remove all empty parts
		return <CompilerHintSplitted> <Json> str
			.split(this.splitterRegExp)
			.filter(part => part.length > 0)
			.map(part => this.isCompilerHintOperatorToken(part) ? ({operator: part}) : part);
	}

	/**
	 * Returns true if the given string represents a valid compiler hint operator token
	 * @param {string} str
	 * @returns {boolean}
	 */
	private isCompilerHintOperatorToken (str: string): str is CompilerHintOperatorToken {
		switch (str) {
			case "||":
			case "&&":
			case "!":
				return true;
			default:
				return false;
		}
	}

	/**
	 * Creates a base IHint
	 * @param {number} pos
	 * @param {number} end
	 * @param {string} code
	 * @returns {IHint}
	 */
	private createHint (pos: number, end: number, code: string): IHint {
		return {pos, end, text: code.slice(pos, end)};
	}

	/**
	 * An indexOf that can take a Regular Expression
	 * @param {string} str
	 * @param {RegExp} regex
	 * @param {number} from
	 * @returns {number}
	 */
	private indexOf (str: string, regex: RegExp, from: number = 0): [number, string] {
		const substring = str.substring(from);
		const indexOf = substring.search(regex);
		const globalIndex = (indexOf >= 0) ? indexOf + from : indexOf;

		if (globalIndex < 0) return [-1, ""];

		const sliced = substring.slice(indexOf);
		const match = sliced.match(regex)!;
		return [globalIndex, match[0]];
	}
}