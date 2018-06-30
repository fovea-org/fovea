import * as Parser from "postcss/lib/parser";
import {CSSExpressionToken, CSSToken} from "../../tokenizer/css-tokenizer/css-token";
import {ICSSTokenizerResult} from "../../tokenizer/css-tokenizer/i-css-tokenizer-result";
import {cssTokenize} from "../../tokenizer/css-tokenizer/css-tokenizer";
import {Expression} from "../../expression/expression";
import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_DOLLAR_SIGN_START, EXPRESSION_QUALIFIER_END} from "@fovea/common";
import {IPostCSSFoveaParser} from "../i-postcss-fovea-parser";

/**
 * A PostCSS parser for Fovea.
 * It extends PostCSS with the possibility of parsing expressions
 */
export class PostCSSFoveaCSSParser extends Parser implements IPostCSSFoveaParser {

	/**
	 * The Tokenizer to use
	 * @type {ICSSTokenizerResult}
	 */
	private tokenizer: ICSSTokenizerResult;

	/**
	 * Creates the Fovea tokenizer
	 */
	public createTokenizer (): void {
		this.tokenizer = cssTokenize(this.input);
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
				node.text = match[2];
				node.text = `$\{${match[2]}}`;
				node.raws.left = match[1];
				node.raws.right = match[3];
			}
		}
	}
}