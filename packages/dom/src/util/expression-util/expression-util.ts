import {IExpressionUtil} from "./i-expression-util";
import {takeInnerExpression} from "@fovea/common";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {createSourceFile, isArrayBindingPattern, isArrayLiteralExpression, isArrowFunction, isAsExpression, isAwaitExpression, isBinaryExpression, isBindingElement, isBlock, isCallExpression, isCaseBlock, isCaseClause, isComputedPropertyName, isConditionalExpression, isDefaultClause, isDeleteExpression, isElementAccessExpression, isExpressionStatement, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isIdentifier, isIfStatement, isLabeledStatement, isLiteralExpression, isMethodDeclaration, isNewExpression, isNonNullExpression, isNoSubstitutionTemplateLiteral, isObjectBindingPattern, isObjectLiteralExpression, isOmittedExpression, isParameter, isParenthesizedExpression, isPostfixUnaryExpression, isPrefixUnaryExpression, isPropertyAccessExpression, isPropertyAssignment, isReturnStatement, isStringLiteral, isSwitchStatement, isTemplateExpression, isTemplateHead, isTemplateMiddle, isTemplateSpan, isTemplateTail, isToken, isTypeAssertion, isTypeReferenceNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isYieldExpression, Node, NodeArray, ScriptTarget, SyntaxKind, tokenToString, TypeOfExpression} from "typescript";
import {IExpressionContentPart, IExpressionContentPartMetadata, IGenerateExpressionContentResult} from "./generate-expression-content-result";
import {RawExpressionBindable} from "../../expression/raw-expression-bindable/raw-expression-bindable";
import {IContext} from "../context-util/i-context";
import {PICKED_GLOBAL_KEYS} from "../global-keys/global-keys";

/**
 * A utility class for working with expressions
 */
export class ExpressionUtil implements IExpressionUtil {
	/**
	 * The thing to prepend "this." with inside identifiers
	 * @type {string}
	 */
	private readonly SCOPE_NAME: string = "this_";

	/**
	 * The prefix to add before host properties
	 * @type {string}
	 */
	private readonly HOST_PREFIX: string = "host";

	constructor (private readonly codeAnalyzer: ICodeAnalyzer) {
	}

	/**
	 * Formats an Expression from some content
	 * @param {string} content
	 * @param {IContext} context
	 * @returns {RawExpressionBindable}
	 */
	public formatExpression (content: string, context: IContext): RawExpressionBindable|string {
		// Take the inner expression. Replace all occurrences of "this." with the empty string
		let inner = takeInnerExpression(content)
			.replace(/this\./g, this.SCOPE_NAME);
		if (inner.length < 1) return inner;

		// If the expression is wrapped in braces, treat it as a Literal expression wrapped in parentheses
		const trimmedInner = inner.trim();
		if (trimmedInner.startsWith("{") && trimmedInner.endsWith("}")) {
			inner = `(${inner})`;
		}

		// Parse it with Typescript
		const {statements} = createSourceFile(generateSourceFileName(), inner, ScriptTarget.Latest);
		// Make sure that there is at least 1 statement
		if (statements.length < 1) return "";

		// Generate the expression content
		const {expressions, isAsync} = this.getExpressionContent(statements, content, context);

		// Return a wrapper function that can receive some known variables that lives within the template itself.
		// This will be combined with foreign identifiers and anything that isn't part of it will be assumed to be global identifiers (such as 'Date' and 'Promise')
		const usedTemplateVariables = (...knownTemplateVariables: string[]): string[] => {
			return [...new Set(expressions.filter(part => part.isTemplateVariable(knownTemplateVariables)).map(part => part.expression))];
		};

		// Return a wrapper function that can receive some additional host identifiers which will be added to the ones referenced by the ExpressionChain itself
		const usedObserverKeysComputed = (knownTemplateVariables: string[], ...additionalObserverKeys: string[]): string[] => {
			return [...new Set([...expressions.filter(part => part.isHostIdentifier(knownTemplateVariables)).map(part => part.observerKey), ...additionalObserverKeys])];
		};

		/**
		 * Computes all of the expressions
		 * @param {string} knownTemplateVariables
		 * @returns {string}
		 */
		const expressionsComputed = (...knownTemplateVariables: string[]) => {
			let flattened = expressions.map(expression => expression.stringify(knownTemplateVariables)).join("");

			// If the first statement cannot be implicitely returned, or if there are multiple statements, and the flattened compute function isn't surrounded by brackets, make sure to add some
			if ((statements.length > 1 || !this.supportsImplicitReturns(statements[0])) && !flattened.startsWith("{")) {
				flattened = `{${flattened}}`;
			}

			return flattened;
		};

		// Generate the computed function
		const computed = (knownTemplateVariables: string[], ...argNames: string[]) => {
			let str = "";
			if (isAsync) str += "async ";
			const isMultiArg = argNames.length > 0;
			if (isMultiArg) str += "(";
			str += this.HOST_PREFIX;
			if (isMultiArg) {
				str += `, {${argNames.join(", ")}})`;
			}
			str += ` => ${expressionsComputed(...knownTemplateVariables)}`;
			return str;
		};

		if (isAsync) context.hasAsyncEvaluations = true;
		else context.hasSyncEvaluations = true;
		return [computed, usedObserverKeysComputed, usedTemplateVariables, isAsync];
	}

	/**
	 * Gets proper ExpressionContent for the given Statements
	 * @param {NodeArray<Node> | Node} statements
	 * @param {string} originalContent
	 * @param {IContext} context
	 * @returns {IGenerateExpressionContentResult}
	 */
	private getExpressionContent (statements: NodeArray<Node>|Node, originalContent: string, context: IContext): IGenerateExpressionContentResult {
		const metadata: IExpressionContentPartMetadata = {isAsync: false, ...context};
		const expressions = this.generateExpressionContent(statements, originalContent, [], metadata);

		return {
			expressions,
			...metadata
		};
	}

	/**
	 * Generates ExpressionContent from the computed statements within an expression
	 * @param {NodeArray<Node> | Node} statements
	 * @param {string} originalContent
	 * @param {string[]} [environment]
	 * @param {IExpressionContentPartMetadata} metadata
	 * @param {Node} [parent]
	 * @param {string} [suffix]
	 * @returns {IExpressionContentPart[]}
	 */
	private generateExpressionContent (statements: NodeArray<Node>|Node, originalContent: string, environment: string[], metadata: IExpressionContentPartMetadata, parent?: Node, suffix?: string): IExpressionContentPart[] {

		const nodes: ReadonlyArray<Node> = Array.isArray(statements) ? statements : <ReadonlyArray<Node>> [statements];
		const result: IExpressionContentPart[] = [];

		nodes.forEach((statement, index) => {
			// Assign the parent to the Node if it is undefined
			if (statement.parent == null) statement.parent = <Readonly<Node>> parent;
			const isLastIndex = index === nodes.length - 1;

			// If it is an Identifier, push the text of it to the ExpressionContent
			if (isIdentifier(statement)) {

				result.push(this.wrapIdentifier(statement.text, environment));
				if (suffix != null && !isLastIndex) result.push(this.wrapIdentifier(suffix, environment));
				return;
			}

			else if (isPropertyAccessExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(`.${statement.name.text}`)
				);
			}

			else if (isElementAccessExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression("["),
					...statement.argumentExpression == null ? [] : this.generateExpressionContent(statement.argumentExpression, originalContent, environment, metadata, statement),
					this.wrapExpression("]")
				);
			}

			else if (isBinaryExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.left, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.operatorToken, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.right, originalContent, environment, metadata, statement)
				);
			}

			else if (isParenthesizedExpression(statement)) {
				result.push(
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(")")
				);
			}

			else if (isStringLiteral(statement)) {
				result.push(
					this.wrapExpression(`\`${statement.text}\``)
				);
			}

			else if (isObjectLiteralExpression(statement)) {
				result.push(
					this.wrapExpression("{"),
					...this.generateExpressionContent(statement.properties, originalContent, environment, metadata, statement, ","),
					this.wrapExpression("}")
				);
			}

			else if (isComputedPropertyName(statement)) {
				result.push(
					this.wrapExpression("["),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression("]")
				);
			}

			else if (isPropertyAssignment(statement)) {
				result.push(
					// If the name is an identifier, treat it as a literal string
					...(isIdentifier(statement.name) ? [this.wrapExpression(statement.name.text)] : this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement)),
					...(statement.initializer == null ? [] : [
						this.wrapExpression(":"),
						...this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement)
					])
				);
			}

			else if (isLiteralExpression(statement)) {
				result.push(
					this.wrapExpression(statement.text)
				);
			}

			else if (isPrefixUnaryExpression(statement)) {
				result.push(
					this.wrapExpression(tokenToString(statement.operator)!),
					...this.generateExpressionContent(statement.operand, originalContent, environment, metadata, statement)
				);
			}

			else if (isPostfixUnaryExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.operand, originalContent, environment, metadata, statement),
					this.wrapExpression(tokenToString(statement.operator)!)
				);
			}

			else if (isVariableStatement(statement)) {
				result.push(
					...this.generateExpressionContent(statement.declarationList, originalContent, environment, metadata, statement),
					this.wrapExpression(";")
				);
			}

			else if (isVariableDeclarationList(statement)) {
				result.push(
					this.wrapExpression("let "),
					...this.generateExpressionContent(statement.declarations, originalContent, environment, metadata, statement, ",")
				);
			}

			else if (isVariableDeclaration(statement)) {
				const name = this.codeAnalyzer.bindingNameService.getName(statement.name);
				// If the name is an identifier, add it to the environment. Otherwise, it may be a BindingPattern in which case it will be handled further down the control flow
				if (isIdentifier(statement.name)) {
					environment.push(name);
				}

				result.push(
					...this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement),
					...(statement.initializer == null ? [] : [
						this.wrapExpression(" = "),
						...this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement)
					])
				);
			}

			else if (isForStatement(statement)) {
				result.push(
					this.wrapExpression("for ("),
					...(statement.initializer == null ? [] : this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement)),
					this.wrapExpression(";"),
					...(statement.condition == null ? [] : this.generateExpressionContent(statement.condition, originalContent, environment, metadata, statement)),
					this.wrapExpression(";"),
					...(statement.incrementor == null ? [] : this.generateExpressionContent(statement.incrementor, originalContent, environment, metadata, statement)),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.statement, originalContent, environment, metadata, statement)
				);
			}

			else if (isForOfStatement(statement)) {
				result.push(
					this.wrapExpression("for "),
					...(statement.awaitModifier == null ? [] : [this.wrapExpression("await ")]),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement),
					this.wrapExpression(" of "),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.statement, originalContent, environment, metadata, statement)
				);
			}

			else if (isForInStatement(statement)) {
				result.push(
					this.wrapExpression("for ("),
					...this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement),
					this.wrapExpression(" in "),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.statement, originalContent, environment, metadata, statement)
				);
			}

			else if (isArrayBindingPattern(statement)) {
				result.push(
					this.wrapExpression("["),
					...this.generateExpressionContent(statement.elements, originalContent, environment, metadata, statement, ","),
					this.wrapExpression("]")
				);
			}

			else if (isObjectBindingPattern(statement)) {
				result.push(
					this.wrapExpression("{"),
					...this.generateExpressionContent(statement.elements, originalContent, environment, metadata, statement, ","),
					this.wrapExpression("}")
				);
			}

			else if (isOmittedExpression(statement)) {
				result.push(
					this.wrapExpression(",")
				);
			}

			else if (isBindingElement(statement)) {
				// Add the binding name to the environment
				if (isIdentifier(statement.name)) {
					environment.push(this.codeAnalyzer.bindingNameService.getName(statement.name));
				}

				if (statement.propertyName != null && isIdentifier(statement.propertyName)) {
					environment.push(this.codeAnalyzer.bindingNameService.getName(statement.propertyName));
				}

				result.push(
					...(statement.dotDotDotToken == null ? [] : [this.wrapExpression("...")]),
					...(statement.propertyName == null
						? this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement)
					  : [
					  	...this.generateExpressionContent(statement.propertyName, originalContent, environment, metadata, statement),
							this.wrapExpression(":"),
							...this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement)
						])
				);
			}

			else if (isYieldExpression(statement)) {

				result.push(
					this.wrapExpression("yield "),
					...(statement.asteriskToken == null ? [] : [this.wrapExpression("*")]),
					...(statement.expression == null ? [] : this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement))
				);
			}

			else if (isTypeAssertion(statement)) {
				const localEnvironment = [...environment, this.codeAnalyzer.typeNodeService.getNameOfType(statement.type)];
				result.push(
					this.wrapExpression("<"),
					...this.generateExpressionContent(statement.type, originalContent, localEnvironment, metadata, statement),
					this.wrapExpression(">"),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement)
				);
			}

			else if (statement.kind === SyntaxKind.TypeOfExpression) {
				result.push(
					this.wrapExpression("typeof "),
					...this.generateExpressionContent((<TypeOfExpression>statement).expression, originalContent, environment, metadata, statement)
				);
			}

			else if (isAsExpression(statement)) {
				const localEnvironment = [...environment, this.codeAnalyzer.typeNodeService.getNameOfType(statement.type)];
				result.push(
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(" as "),
					...this.generateExpressionContent(statement.type, originalContent, localEnvironment, metadata, statement)
				);
			}

			else if (isTypeReferenceNode(statement)) {
				const localEnvironment = [...environment, this.codeAnalyzer.printer.print(statement.typeName)];
				result.push(
					...this.generateExpressionContent(statement.typeName, originalContent, localEnvironment, metadata, statement),
					...(statement.typeArguments == null ? [] : [
						this.wrapExpression("<"),
						...this.generateExpressionContent(statement.typeArguments, originalContent, localEnvironment, metadata, statement, ","),
						this.wrapExpression(">")
					])
				);
			}

			else if (isAwaitExpression(statement)) {
				metadata.isAsync = true;

				result.push(
					this.wrapExpression("await "),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement)
				);
			}

			else if (isNonNullExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression("!"));
			}

			else if (isCallExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					...(statement.typeArguments == null ? [] : [
						this.wrapExpression("<"),
						...this.generateExpressionContent(statement.typeArguments, originalContent, environment, metadata, statement, ","),
						this.wrapExpression(">")
					]),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.arguments, originalContent, environment, metadata, statement, ","),
					this.wrapExpression(")")
				);
			}

			else if (isNewExpression(statement)) {
				result.push(
					this.wrapExpression("new "),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					...(statement.typeArguments == null ? [] : [
						this.wrapExpression("<"),
						...this.generateExpressionContent(statement.typeArguments, originalContent, environment, metadata, statement, ","),
						this.wrapExpression(">")
					]),
					this.wrapExpression("("),
					...(statement.arguments == null ? [] : this.generateExpressionContent(statement.arguments, originalContent, environment, metadata, statement, ",")),
					this.wrapExpression(")")
				);
			}

			else if (isIfStatement(statement)) {
				result.push(
					this.wrapExpression("if("),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.thenStatement, originalContent, environment, metadata, statement),
					...(statement.elseStatement == null ? [] : this.generateExpressionContent(statement.elseStatement, originalContent, environment, metadata, statement))
				);
			}

			else if (isDeleteExpression(statement)) {
				result.push(
					// 'delete' may be a method on the prototype
					this.wrapExpression("delete"),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(")")
				);
			}

			else if (isArrowFunction(statement)) {
				// Take the parameter names. We want to make sure that the recursive call won't compute identifiers for them
				const parameterNames = statement.parameters.map(parameter => this.codeAnalyzer.parameterService.getName(parameter));

				// Generate new non-identifiers for the recursive call
				const localEnvironment = [...environment, ...parameterNames];

				result.push(
					...(this.codeAnalyzer.modifierService.isAsync(statement) ? [this.wrapExpression("async ")] : []),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.parameters, originalContent, localEnvironment, metadata, statement, ","),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.equalsGreaterThanToken, originalContent, localEnvironment, metadata, statement),
					...this.generateExpressionContent(statement.body, originalContent, localEnvironment, metadata, statement)
				);
			}

			else if (isTemplateExpression(statement)) {
				result.push(
					this.wrapExpression("`"),
					...this.generateExpressionContent(statement.head, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.templateSpans, originalContent, environment, metadata, statement),
					this.wrapExpression("`")
				);
			}

			else if (isTemplateSpan(statement)) {
				result.push(
					this.wrapExpression("${"),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression("}"),
					...this.generateExpressionContent(statement.literal, originalContent, environment, metadata, statement)
				);
			}

			else if (isNoSubstitutionTemplateLiteral(statement)) {
				result.push(
					this.wrapExpression(statement.text)
				);
			}

			else if (isTemplateHead(statement) || isTemplateMiddle(statement) || isTemplateTail(statement)) {
				result.push(
					this.wrapExpression(statement.text)
				);
			}

			else if (isArrayLiteralExpression(statement)) {
				result.push(
					this.wrapExpression("["),
					...this.generateExpressionContent(statement.elements, originalContent, environment, metadata, statement, ","),
					this.wrapExpression("]")
				);
			}

			else if (isFunctionExpression(statement)) {
				// Take the parameter names. We want to make sure that the recursive call won't compute identifiers for them
				const parameterNames = statement.parameters.map(parameter => this.codeAnalyzer.parameterService.getName(parameter));

				// Generate new non-identifiers for the recursive call
				const localEnvironment = [...environment, ...parameterNames];

				result.push(
					...(this.codeAnalyzer.modifierService.isAsync(statement) ? [this.wrapExpression("async ")] : []),
					this.wrapExpression("function"),
					...(statement.asteriskToken == null ? [] : [this.wrapExpression("*")]),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.parameters, originalContent, localEnvironment, metadata, statement, ","),
					this.wrapExpression(")"),
					...this.generateExpressionContent(statement.body, originalContent, localEnvironment, metadata, statement)
				);
			}

			else if (isSwitchStatement(statement)) {
				result.push(
					this.wrapExpression("switch("),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression("){"),
					...this.generateExpressionContent(statement.caseBlock, originalContent, environment, metadata, statement),
					this.wrapExpression("}")
				);
			}

			else if (isCaseBlock(statement)) {
				result.push(
					...this.generateExpressionContent(statement.clauses, originalContent, environment, metadata, statement)
				);
			}

			else if (isCaseClause(statement)) {
				result.push(
					this.wrapExpression("case "),
					...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement),
					this.wrapExpression(": {"),
					...this.generateExpressionContent(statement.statements, originalContent, environment, metadata, statement),
					this.wrapExpression("}")
				);
			}

			else if (isDefaultClause(statement)) {
				result.push(
					this.wrapExpression("default:{"),
					...this.generateExpressionContent(statement.statements, originalContent, environment, metadata, statement),
					this.wrapExpression("}")
				);
			}

			else if (isReturnStatement(statement)) {
				result.push(
					this.wrapExpression("return "),
					...(statement.expression == null ? [] : this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement))
				);
			}

			else if (isMethodDeclaration(statement)) {
				// Take the parameter names as well as the function name. We want to make sure that the recursive call won't compute identifiers for them
				const parameterNames = statement.parameters.map(parameter => this.codeAnalyzer.parameterService.getName(parameter));
				const methodName = this.codeAnalyzer.methodService.getName(statement);

				// Bind the method name to the environment
				environment = [
					...environment,
					methodName
				];

				// Generate a new local environment for the local scope of the method
				const localEnvironment = [...environment, ...parameterNames];

				result.push(
					...(this.codeAnalyzer.modifierService.isAsync(statement) ? [this.wrapExpression("async ")] : []),
					...this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement),
					...(statement.asteriskToken == null ? [] : [this.wrapExpression("*")]),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.parameters, originalContent, localEnvironment, metadata, statement, ","),
					this.wrapExpression(")"),
					...(statement.body == null ? [] : this.generateExpressionContent(statement.body, originalContent, localEnvironment, metadata, statement))
				);
			}

			else if (isFunctionDeclaration(statement)) {
				// Take the parameter names as well as the function name. We want to make sure that the recursive call won't compute identifiers for them
				const parameterNames = statement.parameters.map(parameter => this.codeAnalyzer.parameterService.getName(parameter));

				// Bind the function name to the current environment
				environment = [
					...environment,
					// Also include the name of the function, if any
					...(statement.name == null ? [] : [statement.name.text])
				];

				// Generate a new environment for the local execution block
				const localEnvironment = [
					...environment,
					// Within the block scope of the function, the function arguments take precedence
					...parameterNames
				];

				result.push(
					...(this.codeAnalyzer.modifierService.isAsync(statement) ? [this.wrapExpression("async ")] : []),
					this.wrapExpression("function "),
					...(statement.asteriskToken == null ? [] : [this.wrapExpression("*")]),
					...(statement.name == null ? [] : this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement)),
					this.wrapExpression("("),
					...this.generateExpressionContent(statement.parameters, originalContent, localEnvironment, metadata, statement, ","),
					this.wrapExpression(")"),
					...(statement.body == null ? [] : this.generateExpressionContent(statement.body, originalContent, localEnvironment, metadata, statement))
				);
			}

			else if (isBlock(statement)) {
				result.push(
					this.wrapExpression("{"),
					...this.generateExpressionContent(statement.statements, originalContent, environment, metadata, statement, ";"),
					this.wrapExpression("}")
				);
			}

			else if (isExpressionStatement(statement)) {
				result.push(...this.generateExpressionContent(statement.expression, originalContent, environment, metadata, statement));
			}

			else if (isParameter(statement)) {
				result.push(
					...(statement.dotDotDotToken == null ? [] : this.generateExpressionContent(statement.dotDotDotToken, originalContent, environment, metadata, statement)),
					...this.generateExpressionContent(statement.name, originalContent, environment, metadata, statement),
					...(statement.initializer == null ? [] : this.generateExpressionContent(statement.initializer, originalContent, environment, metadata, statement))
				);
			}

			else if (isLabeledStatement(statement)) {
				result.push(
					...this.generateExpressionContent(statement.label, originalContent, environment, metadata, statement),
					this.wrapExpression(":"),
					...this.generateExpressionContent(statement.statement, originalContent, environment, metadata, statement)
				);
			}

			else if (isConditionalExpression(statement)) {
				result.push(
					...this.generateExpressionContent(statement.condition, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.questionToken, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.whenTrue, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.colonToken, originalContent, environment, metadata, statement),
					...this.generateExpressionContent(statement.whenFalse, originalContent, environment, metadata, statement)
				);
			}

			else if (isToken(statement)) {
				result.push(
					this.wrapExpression(statement.kind === SyntaxKind.ThisKeyword ? this.HOST_PREFIX : tokenToString(statement.kind)!)
				);
			}

			else {
				// TODO: Add to diagnostics instead of just throwing
				throw new TypeError(`You provided an expression that is not yet supported around here: ${originalContent} in a template. You can submit an issue on Github describing that ${SyntaxKind[statement.kind]}s are not supported and that you want them to be!'}`);
			}
			if (suffix != null && !isLastIndex) {
				const lastElement = result[result.length - 1];
				if (lastElement != null && lastElement.expression !== suffix) {
					result.push(this.wrapExpression(suffix));
				}
			}
		});
		return result;
	}

	/**
	 * Wraps an expression
	 * @param {string} expression
	 * @param {string[]} nonIdentifiers
	 * @returns {IExpressionContentPart}
	 */
	private wrapIdentifier (expression: string, nonIdentifiers: string[]): IExpressionContentPart {

		/**
		 * Checks if the given identifier is a host identifier
		 * @param {string[]} templateVariables
		 * @returns {boolean}
		 */
		const isHostIdentifier = (templateVariables: string[]) => {
			const isScoped = expression.startsWith(this.SCOPE_NAME);
			const normalizedText = isScoped ? expression.slice(this.SCOPE_NAME.length) : expression;
			const isNonIdentifier = !isScoped && nonIdentifiers.includes(normalizedText);
			const isATemplateVariable = !isScoped && !isNonIdentifier && templateVariables.includes(normalizedText);
			const isHostItself = normalizedText === this.HOST_PREFIX;
			return !isHostItself && !isNonIdentifier && !isATemplateVariable && (isScoped || (!PICKED_GLOBAL_KEYS.has(normalizedText)));
		};

		/**
		 * Checks if the given identifier is a template variable
		 * @param {string[]} templateVariables
		 * @returns {boolean}
		 */
		const isTemplateVariable = (templateVariables: string[]) => {
			const isScoped = expression.startsWith(this.SCOPE_NAME);
			const normalizedText = isScoped ? expression.slice(this.SCOPE_NAME.length) : expression;
			const isNonIdentifier = !isScoped && nonIdentifiers.includes(normalizedText);
			return !isScoped && !isNonIdentifier && templateVariables.includes(normalizedText);
		};

		return {
			expression,
			observerKey: expression.startsWith(this.SCOPE_NAME) ? expression.slice(this.SCOPE_NAME.length) : expression,
			stringify: (templateVariables: string[]) => {
				const isScoped = expression.startsWith(this.SCOPE_NAME);
				const normalizedText = isScoped ? expression.slice(this.SCOPE_NAME.length) : expression;
				return isHostIdentifier(templateVariables) ? `${this.HOST_PREFIX}.${normalizedText}` : normalizedText;
			},
			isHostIdentifier: (templateVariables: string[]) => {
				return isHostIdentifier(templateVariables);
			},
			isTemplateVariable: (templateVariables: string[]) => {
				return isTemplateVariable(templateVariables);
			}
		};
	}

	/**
	 * Wraps an expression
	 * @param {string} expression
	 * @returns {IExpressionContentPart}
	 */
	private wrapExpression (expression: string): IExpressionContentPart {
		return {
			expression,
			observerKey: expression,
			stringify: (_templateVariables: string[]) => {
				return expression;
			},
			isHostIdentifier: (_templateVariables: string[]) => {
				return false;
			},
			isTemplateVariable: (_templateVariables: string[]) => {
				return false;
			}
		};
	}

	/**
	 * Returns true if the node can be provided to an arrow function that implicitly returns
	 * @param {Node} node
	 * @returns {boolean}
	 */
	private supportsImplicitReturns (node: Node): boolean {
		switch (node.kind) {
			case SyntaxKind.SwitchStatement:
			case SyntaxKind.DoStatement:
			case SyntaxKind.ForInStatement:
			case SyntaxKind.ForStatement:
			case SyntaxKind.ForOfStatement:
			case SyntaxKind.ReturnStatement:
			case SyntaxKind.VariableStatement:
			case SyntaxKind.WhileStatement:
			case SyntaxKind.IfStatement:
			case SyntaxKind.TryStatement:
				return false;

			default:
				return true;
		}
	}
}

/**
 * Generates a random filename to use when parsing an expression
 * @returns {string}
 */
function generateSourceFileName (): string {
	return `filename_${Math.random() * 100}.ts`;
}