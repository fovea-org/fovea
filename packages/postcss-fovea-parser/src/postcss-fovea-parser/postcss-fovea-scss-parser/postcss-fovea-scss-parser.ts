import * as ScssParser from "postcss-scss/lib/scss-parser";
import {IPostCSSFoveaParser} from "../i-postcss-fovea-parser";
import {scssTokenize} from "../../tokenizer/scss-tokenizer/scss-tokenizer";
import {ISCSSTokenizerResult} from "../../tokenizer/scss-tokenizer/i-scss-tokenizer-result";
import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_DOLLAR_SIGN_START, EXPRESSION_QUALIFIER_END} from "@fovea/common";
import {CSSExpressionToken, CSSToken} from "../../tokenizer/css-tokenizer/css-token";
import {Expression} from "../../expression/expression";

/**
 * A PostCSS parser for Fovea for SCSS.
 * It extends PostCSS with the possibility of parsing expressions
 */
export class PostCSSFoveaSCSSParser extends ScssParser implements IPostCSSFoveaParser {

	/**
	 * The Tokenizer to use
	 * @type {ISCSSTokenizerResult}
	 */
	private tokenizer: ISCSSTokenizerResult;

	/**
	 * Creates the Fovea tokenizer
	 */
	public createTokenizer (): void {
		this.tokenizer = scssTokenize(this.input);
	}

	/**
	 * Parses the given CSS
	 */
	public parse (): void {
		let token: CSSToken;

		while (!this.tokenizer.endOfFile()) {
			token = this.tokenizer.nextToken()!;

			switch (token[0]) {

				case "space":
					this.spaces += token[1];
					break;

				case "expression":
					this.expression(<CSSExpressionToken> token);
					break;

				case ";":
					this.freeSemicolon(token);
					break;

				case "}":
					this.end(token);
					break;

				case "comment":
					this.comment(token);
					break;

				case "at-word":
					this.atrule(token);
					break;

				case "{":
					this.emptyRule(token);
					break;

				default:
					this.other(token);
					break;
			}
		}
		this.endFile();
	}

	/**
	 * Invoked when an ExpressionToken has been seen
	 * @param {CSSExpressionToken} token
	 */
	private expression (token: CSSExpressionToken): void {
		const node = new Expression();
		this.init(node, token[2], token[3]);
		node.source.end = {line: token[4], column: token[5]};

		const text = token[1].slice(EXPRESSION_QUALIFIER_DOLLAR_SIGN_START.length + EXPRESSION_QUALIFIER_BRACKET_START.length, -EXPRESSION_QUALIFIER_END.length);
		if (/^\s*$/.test(text)) {
			node.text = "";
			node.raws.left = text;
			node.raws.right = "";
		} else {
			const match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
			if (match != null) {
				node.text = `$\{${match[2]}}`;
				node.raws.left = match[1];
				node.raws.right = match[3];
			}
		}
	}
}