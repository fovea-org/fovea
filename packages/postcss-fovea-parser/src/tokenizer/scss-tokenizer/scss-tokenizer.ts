import {ISCSSTokenizerOptions} from "./i-scss-tokenizer-options";
import {ISCSSTokenizerResult} from "./i-scss-tokenizer-result";
import {SCSSToken, SCSSTokenKind} from "./scss-token";
import {ISCSSTokenizerInput} from "./i-scss-tokenizer-input";
import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_DOLLAR_SIGN_START, EXPRESSION_QUALIFIER_END} from "@fovea/common";

const SINGLE_QUOTE = "\'".charCodeAt(0);
const DOUBLE_QUOTE = "\"".charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const NEWLINE = "\n".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const FEED = "\f".charCodeAt(0);
const TAB = "\t".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const OPEN_SQUARE = "[".charCodeAt(0);
const CLOSE_SQUARE = "]".charCodeAt(0);
const OPEN_PARENTHESES = "(".charCodeAt(0);
const CLOSE_PARENTHESES = ")".charCodeAt(0);
const OPEN_CURLY = "{".charCodeAt(0);
const CLOSE_CURLY = "}".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const COLON = ":".charCodeAt(0);
const AT = "@".charCodeAt(0);

// SCSS PATCH {
const COMMA = ",".charCodeAt(0);
const HASH = "#".charCodeAt(0);
// } SCSS PATCH

const RE_AT_END = /[ \n\t\r\f{()'"\\;/\[\]#]/g;
const RE_WORD_END = /[ \n\t\r\f(){}:;@!'"\\\]\[#]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\\\/("'\n]/;
const RE_HEX_ESCAPE = /[a-f0-9]/i;

const RE_NEW_LINE = /[\r\f\n]/g; // SCSS PATCH

const EXPRESSION_START_1 = EXPRESSION_QUALIFIER_DOLLAR_SIGN_START.charCodeAt(0);
const EXPRESSION_START_2 = EXPRESSION_QUALIFIER_BRACKET_START.charCodeAt(0);

/**
 * Tokenizes the given input
 * @param {ISCSSTokenizerInput} input
 * @param {Partial<ISCSSTokenizerOptions>} options
 * @returns {ISCSSTokenizerResult}
 */
export function scssTokenize (input: ISCSSTokenizerInput, options: Partial<ISCSSTokenizerOptions> = {}): ISCSSTokenizerResult {
	const css: string = input.css.valueOf();
	const ignore = options.ignoreErrors == null ? false : options.ignoreErrors;

	let code: number;
	let next: number;
	let quote: string;
	let lines: string[];
	let last: number;
	let content: string;
	let escape: boolean;
	let nextLine: number;
	let nextOffset: number;
	let escaped: boolean;
	let escapePos: number;
	let prev: string;
	let n: number;
	let currentToken: SCSSToken;

	let brackets; // SCSS PATCH

	const length = css.length;
	let offset = -1;
	let line = 1;
	let pos = 0;
	const buffer: SCSSToken[] = [];
	const returned: SCSSToken[] = [];

	/**
	 * Throws an error for an unclosed token
	 * @param {SCSSTokenKind} what
	 */
	function unclosed (what: SCSSTokenKind): void {
		throw input.error("Unclosed " + what, line, pos - offset);
	}

	/**
	 * Returns true if we're at the end of the file
	 * @returns {boolean}
	 */
	function endOfFile (): boolean {
		return returned.length === 0 && pos >= length;
	}

	/**
	 * Returns the next token
	 * @returns {SCSSToken | undefined}
	 */
	function nextToken (): SCSSToken|undefined {
		if (returned.length > 0) return returned.pop();
		if (pos >= length) return;

		code = css.charCodeAt(pos);
		if (code === NEWLINE || code === FEED ||
			code === CR && css.charCodeAt(pos + 1) !== NEWLINE) {
			offset = pos;
			line += 1;
		}

		switch (code) {
			case NEWLINE:
			case SPACE:
			case TAB:
			case CR:
			case FEED:
				next = pos;
				do {
					next += 1;
					code = css.charCodeAt(next);
					if (code === NEWLINE) {
						offset = next;
						line += 1;
					}
				} while (code === SPACE ||
				code === NEWLINE ||
				code === TAB ||
				code === CR ||
				code === FEED);

				currentToken = ["space", css.slice(pos, next)];
				pos = next - 1;
				break;

			case OPEN_SQUARE:
				currentToken = ["[", "[", line, pos - offset];
				break;

			case CLOSE_SQUARE:
				currentToken = ["]", "]", line, pos - offset];
				break;

			case OPEN_CURLY:
				currentToken = ["{", "{", line, pos - offset];
				break;

			case CLOSE_CURLY:
				currentToken = ["}", "}", line, pos - offset];
				break;

			// SCSS PATCH {
			case COMMA:
				currentToken = [
					"word",
					",",
					line, pos - offset,
					line, pos - offset + 1
				];
				break;
			// } SCSS PATCH

			case COLON:
				currentToken = [":", ":", line, pos - offset];
				break;

			case SEMICOLON:
				currentToken = [";", ";", line, pos - offset];
				break;

			case OPEN_PARENTHESES:
				prev = buffer.length > 0 ? buffer.pop()![1] : "";
				n = css.charCodeAt(pos + 1);
				if (prev === "url" &&
					n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE &&
					n !== SPACE && n !== NEWLINE && n !== TAB &&
					n !== FEED && n !== CR) {
					// SCSS PATCH {
					brackets = 1;
					escaped = false;
					next = pos + 1;
					while (next <= css.length - 1) {
						n = css.charCodeAt(next);
						if (n === BACKSLASH) {
							escaped = !escaped;
						} else if (n === OPEN_PARENTHESES) {
							brackets += 1;
						} else if (n === CLOSE_PARENTHESES) {
							brackets -= 1;
							if (brackets === 0) break;
						}
						next += 1;
					}

					content = css.slice(pos, next + 1);
					lines = content.split("\n");
					last = lines.length - 1;

					if (last > 0) {
						nextLine = line + last;
						nextOffset = next - lines[last].length;
					} else {
						nextLine = line;
						nextOffset = offset;
					}

					currentToken = ["brackets", content,
						line, pos - offset,
						nextLine, next - nextOffset
					];

					offset = nextOffset;
					line = nextLine;
					pos = next;
					// } SCSS PATCH

				} else {
					next = css.indexOf(")", pos + 1);
					content = css.slice(pos, next + 1);

					if (next === -1 || RE_BAD_BRACKET.test(content)) {
						currentToken = ["(", "(", line, pos - offset];
					} else {
						currentToken = ["brackets", content,
							line, pos - offset,
							line, next - offset
						];
						pos = next;
					}
				}

				break;

			case CLOSE_PARENTHESES:
				currentToken = [")", ")", line, pos - offset];
				break;

			case SINGLE_QUOTE:
			case DOUBLE_QUOTE:
				quote = code === SINGLE_QUOTE ? "\'" : "\"";
				next = pos;
				do {
					escaped = false;
					next = css.indexOf(quote, next + 1);
					if (next === -1) {
						if (ignore) {
							next = pos + 1;
							break;
						} else {
							unclosed("string");
						}
					}
					escapePos = next;
					while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
						escapePos -= 1;
						escaped = !escaped;
					}
				} while (escaped);

				content = css.slice(pos, next + 1);
				lines = content.split("\n");
				last = lines.length - 1;

				if (last > 0) {
					nextLine = line + last;
					nextOffset = next - lines[last].length;
				} else {
					nextLine = line;
					nextOffset = offset;
				}

				currentToken = ["string", css.slice(pos, next + 1),
					line, pos - offset,
					nextLine, next - nextOffset
				];

				offset = nextOffset;
				line = nextLine;
				pos = next;
				break;

			case AT:
				RE_AT_END.lastIndex = pos + 1;
				RE_AT_END.test(css);
				if (RE_AT_END.lastIndex === 0) {
					next = css.length - 1;
				} else {
					next = RE_AT_END.lastIndex - 2;
				}

				currentToken = ["at-word", css.slice(pos, next + 1),
					line, pos - offset,
					line, next - offset
				];

				pos = next;
				break;

			case BACKSLASH:
				next = pos;
				escape = true;
				while (css.charCodeAt(next + 1) === BACKSLASH) {
					next += 1;
					escape = !escape;
				}
				code = css.charCodeAt(next + 1);
				if (escape && (code !== SLASH &&
					code !== SPACE &&
					code !== NEWLINE &&
					code !== TAB &&
					code !== CR &&
					code !== FEED)) {
					next += 1;
					if (RE_HEX_ESCAPE.test(css.charAt(next))) {
						while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
							next += 1;
						}
						if (css.charCodeAt(next + 1) === SPACE) {
							next += 1;
						}
					}
				}

				currentToken = ["word", css.slice(pos, next + 1),
					line, pos - offset,
					line, next - offset
				];

				pos = next;
				break;
			default:
				n = css.charCodeAt(pos + 1);

				// If we're about to enter an expression
				if (code === EXPRESSION_START_1 && css.charCodeAt(pos + 1) === EXPRESSION_START_2) {
					next = getExpressionEndIndex(css, pos + 2);

					if (next === 0) {
						if (ignore) {
							next = css.length;
						} else {
							unclosed("expression");
						}
					}

					currentToken = ["expression", css.slice(pos, next + 1),
						line, pos - offset,
						line, next - offset
					];

					buffer.push(currentToken);
					pos = next;
				}

				else if (code === HASH && n === OPEN_CURLY) {
					let deep = 1;
					next = pos;
					while (deep > 0) {
						next += 1;
						if (css.length <= next) unclosed("interpolation");

						code = css.charCodeAt(next);
						n = css.charCodeAt(next + 1);

						if (code === EXPRESSION_START_1 && css.charCodeAt(next + 1) === EXPRESSION_START_2) {
							next = getExpressionEndIndex(css, next + 2);

							if (next === 0) {
								if (ignore) {
									next = css.length;
								} else {
									unclosed("expression");
								}
							}
						}

						else {
							if (code === CLOSE_CURLY) {
								deep -= 1;
							} else if (code === HASH && n === OPEN_CURLY) {
								deep += 1;
							}
						}

					}

					content = css.slice(pos, next + 1);
					lines = content.split("\n");
					last = lines.length - 1;

					if (last > 0) {
						nextLine = line + last;
						nextOffset = next - lines[last].length;
					} else {
						nextLine = line;
						nextOffset = offset;
					}

					currentToken = ["word", content,
						line, pos - offset,
						nextLine, next - nextOffset
					];

					offset = nextOffset;
					line = nextLine;
					pos = next;

				} else if (code === SLASH && n === ASTERISK) {
					// } SCSS PATCH
					next = css.indexOf("*/", pos + 2) + 1;
					if (next === 0) {
						if (ignore) {
							next = css.length;
						} else {
							unclosed("comment");
						}
					}

					content = css.slice(pos, next + 1);
					lines = content.split("\n");
					last = lines.length - 1;

					if (last > 0) {
						nextLine = line + last;
						nextOffset = next - lines[last].length;
					} else {
						nextLine = line;
						nextOffset = offset;
					}

					currentToken = ["comment", content,
						line, pos - offset,
						nextLine, next - nextOffset
					];

					offset = nextOffset;
					line = nextLine;
					pos = next;

					// SCSS PATCH {
				} else if (code === SLASH && n === SLASH) {
					RE_NEW_LINE.lastIndex = pos + 1;
					RE_NEW_LINE.test(css);
					if (RE_NEW_LINE.lastIndex === 0) {
						next = css.length - 1;
					} else {
						next = RE_NEW_LINE.lastIndex - 2;
					}

					content = css.slice(pos, next + 1);

					currentToken = ["comment", content,
						line, pos - offset,
						line, next - offset,
						"inline"
					];

					pos = next;
					// } SCSS PATCH

				} else {
					RE_WORD_END.lastIndex = pos + 1;
					RE_WORD_END.test(css);
					if (RE_WORD_END.lastIndex === 0) {
						next = css.length - 1;
					} else {
						next = RE_WORD_END.lastIndex - 2;
					}

					currentToken = ["word", css.slice(pos, next + 1),
						line, pos - offset,
						line, next - offset
					];

					buffer.push(currentToken);

					pos = next;
				}

				break;
		}

		pos++;
		return currentToken;
	}

	/**
	 * Pushes the given token to the returned tokens
	 * @param {SCSSToken} token
	 */
	function back (token: SCSSToken): void {
		returned.push(token);
	}

	return {
		back,
		nextToken,
		endOfFile
	};
}

/**
 * Gets the matching index position of the closing qualifier for an expression
 * @param {string} css
 * @param {number} from
 * @returns {number}
 */
function getExpressionEndIndex (css: string, from: number): number {
	let toIgnore = 0;
	let closingIndex = -1;

	for (let i = from + 1; i < css.length; i++) {
		if (css[i] === EXPRESSION_QUALIFIER_END) {
			if (toIgnore === 0) {
				closingIndex = i;
				break;
			} else {
				toIgnore -= 1;
			}
		}

		else if (css[i] === EXPRESSION_QUALIFIER_BRACKET_START) {
			toIgnore += 1;
		}
	}
	return closingIndex;
}