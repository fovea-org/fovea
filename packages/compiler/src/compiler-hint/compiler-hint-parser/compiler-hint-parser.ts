import {ICompilerHintParser} from "./i-compiler-hint-parser";
import {CompilerHintAst} from "../compiler-hint-ast/compiler-hint-ast";
import {ICompilerHintTokenizer} from "../compiler-hint-tokenizer/i-compiler-hint-tokenizer";
import {CompilerHintToken} from "../compiler-hint-token/compiler-hint-token";

/**
 * A class that can parse a SourceFile for CompilerHints
 */
export class CompilerHintParser implements ICompilerHintParser {
	constructor (private readonly tokenizer: ICompilerHintTokenizer) {
	}

	/**
	 * Parses the given code and constructs a CompilerHintAst
	 * @param {string} code
	 * @param {CompilerHintAst} [ast]
	 * @returns {CompilerHintAst}
	 */
	public parse (code: string, ast: CompilerHintAst = []): CompilerHintAst {
		let cursor = 0;

		while (true) {
			// Take the next index of an IF statement
			const [nextIndexOfIfStatement, nextIfStatement] = this.tokenizer.nextIfStatement(code, cursor);
			if (nextIndexOfIfStatement < 0) break;

			// Take the expression of the IF statement
			const expression = this.tokenizer.takeIfExpression(nextIfStatement);
			const splittedExpression = this.tokenizer.splitByOperators(expression);
			// Take the next index of an END statement
			const [nextIndexOfEndStatement, nextEndStatement] = this.tokenizer.nextEndStatement(code, cursor);
			if (nextIndexOfEndStatement < 0) break;

			// Take the hint of the END statement
			const [hintKind, hintExpression] = this.tokenizer.takeEndHint(nextEndStatement);

			if (hintKind === CompilerHintToken.IF) {

				// If the expression of the hint is not equal to that of the expression, don't add it to the AST
				if (hintExpression === expression) {
					// Add it to the AST
					ast.push(this.tokenizer.createIfHint(
						nextIndexOfIfStatement,
						nextIndexOfIfStatement + nextIfStatement.length,
						splittedExpression,
						this.tokenizer.createEndHint(
							nextIndexOfEndStatement,
							nextIndexOfEndStatement + nextEndStatement.length,
							hintKind,
							code
						),
						code
					));
				}
			}

			cursor = nextIndexOfEndStatement + nextEndStatement.length + 1;
		}
		return ast;
	}

}