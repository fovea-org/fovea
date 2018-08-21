import {IHostAttributesExtractor} from "./i-host-attributes-extractor";
import {IFoveaDOM} from "@fovea/dom";
import {IHostAttributesExtractOptions} from "./i-host-attributes-extract-options";
import {ILibUser} from "../lib-user/i-lib-user";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {Decorator, Expression, isAccessor, isCallExpression, isMethodDeclaration, isNoSubstitutionTemplateLiteral, isNumericLiteral, isObjectLiteralExpression, isPropertyAssignment, isRegularExpressionLiteral, isShorthandPropertyAssignment, isSpreadAssignment, isStringLiteral, isTemplateLiteral, Node, SyntaxKind} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IConfiguration} from "../configuration/i-configuration";
import {Json, libHelperName, IHostAttributeValues} from "@fovea/common";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that generates host attributes instructions to a Fovea component
 */
export class HostAttributesExtractor implements IHostAttributesExtractor {

	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaDOM: IFoveaDOM,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @hostAttributes decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.hostAttributesDecoratorName}`);
	}

	/**
	 * Generates template instructions. Can receive a template from a decorator or from a 'template' method on the component prototype.
	 * @param {IHostAttributesExtractOptions} options
	 * @returns {void}
	 */
	public extract (options: IHostAttributesExtractOptions): void {
		const {mark, compilerOptions, context} = options;

		// First, check if the class is annotated with a @hostAttributes decorator
		const decorator = this.codeAnalyzer.classService.getDecorator(this.decoratorNameRegex, mark.classDeclaration);
		if (decorator == null) return;
		// Generate template or style contents from the decorator
		this.generateFromDecorator(options, decorator);

		// Remove the decorator. We are done with it
		if (!compilerOptions.dryRun) {
			context.container.remove(decorator.pos, decorator.end);
		}
	}

	/**
	 * Generates a template from a '@hostAttributes decorator on the component
	 * @param {IHostAttributesExtractOptions} options
	 * @param {Decorator} decorator
	 * @returns {void}
	 */
	private generateFromDecorator ({context, compilerOptions, mark, insertPlacement}: IHostAttributesExtractOptions, decorator: Decorator): void {
		const addInvalidDecoratorDiagnostic = () => this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_HOST_ATTRIBUTES_DECORATOR_USAGE, hostName: mark.className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
		const addOnlyLiteralValuesSupportedHereDiagnostic = () => this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.ONLY_LITERAL_VALUES_SUPPORTED_HERE, hostName: mark.className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});

		// The contents will either be empty if @hostAttributes() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
		if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {
			addInvalidDecoratorDiagnostic();
			return;
		}

		// Attempt to parse host attributes from the decorator contents
		let hostAttributes: IHostAttributeValues;
		try {
			hostAttributes = this.parseRawHostAttributeValues(
				decorator.expression.arguments[0],
				addInvalidDecoratorDiagnostic,
				addOnlyLiteralValuesSupportedHereDiagnostic
			);
		} catch (ex) {
			// If for some reason the host attributes couldn't be parsed, return immediately. Diagnostics has been added within the parsing step
			return;
		}

		try {
			// Generate DOM instructions for the class. Skip style tags and pass them on to the style generator
			const {requiredHelpers, instructions, referencedCustomSelectors, ...stats} = this.foveaDOM.generate({hostAttributes, dryRun: compilerOptions.dryRun});

			// Add the IFoveaStats for the file
			this.stats.setHasHostAttributes(context.container.file, true);

			if (stats.hasSyncEvaluations) {
				this.stats.setHasSyncEvaluations(context.container.file, true);
			}

			if (stats.hasAsyncEvaluations) {
				this.stats.setHasAsyncEvaluations(context.container.file, true);
			}

			if (stats.hasTemplateListeners) {
				this.stats.setHasTemplateListeners(context.container.file, true);
			}

			if (stats.hasTemplateCustomAttributes) {
				this.stats.setHasTemplateCustomAttributes(context.container.file, true);
			}

			if (stats.hasTemplateRefs) {
				this.stats.setHasTemplateRefs(context.container.file, true);
			}

			if (stats.hasTemplateAttributes) {
				this.stats.setHasTemplateAttributes(context.container.file, true);
			}

			if (referencedCustomSelectors.length > 0) {
				const existingReferencedCustomSelectors = this.stats.getStatsForFile(context.container.file).referencedCustomSelectors;
				this.stats.setReferencedCustomSelectors(context.container.file, [...existingReferencedCustomSelectors, ...referencedCustomSelectors]);
			}

			if (!compilerOptions.dryRun) {

				const expression = `${this.libUser.use("registerHostAttributes", compilerOptions, context)}((host, {${[...requiredHelpers].map(requiredHelper => libHelperName[requiredHelper]).join(", ")}}) => {\n		${instructions.split("\n").map(line => `	${line}`).join("\n		")}\n		}, this);`;

				const registerBody = (
					this.foveaHostUtil.isBaseComponent(mark.classDeclaration)
						? `\n		${expression}`
						: `\n		// ts-ignore` +
						`\n		if (super.${this.configuration.postCompile.registerHostAttributesMethodName} != null) super.${this.configuration.postCompile.registerHostAttributesMethodName}();` +
						`\n		${expression}`
				);

				const connectBody = (
					`\n		${this.libUser.use("connectHostAttributes", compilerOptions, context)}(this);`
				);

				const disposeBody = (
					`\n		${this.libUser.use("disposeHostAttributes", compilerOptions, context)}(this);`
				);

				// Create the register method
				context.container.appendLeft(
					mark.classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerHostAttributesMethodName} (): void {` +
					`${registerBody}` +
					`\n	}`
				);

				// Create the connect method
				context.container.appendLeft(
					mark.classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.connectHostAttributesMethodName} (): void {` +
					`${connectBody}` +
					`\n	}`
				);

				// Create the dispose method
				context.container.appendLeft(
					mark.classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.disposeHostAttributesMethodName} (): void {` +
					`${disposeBody}` +
					`\n	}`
				);


				// Add an instruction to invoke the static method
				context.container.appendAtPlacement(
					`\n${mark.className}.${this.configuration.postCompile.registerHostAttributesMethodName}();`,
					insertPlacement
				);
			}
		}

		catch (ex) {
			this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_TEMPLATE, formattedErrorMessage: ex.toString()});
		}
	}

	/**
	 * Parses the content of the argument provided to the @hostAttributes decorator
	 * @param {Node} node
	 * @param {() => void} invalidHostAttributesDecoratorUsageCtor
	 * @param {() => void} onlyLiteralValuesSupportedHereCtor
	 * @returns {IHostAttributeValues|void}
	 */
	private parseRawHostAttributeValues (node: Node, invalidHostAttributesDecoratorUsageCtor: () => void, onlyLiteralValuesSupportedHereCtor: () => void): IHostAttributeValues {
		const hostAttributes: IHostAttributeValues = {};

		// Currently we only support object literal expressions
		if (!isObjectLiteralExpression(node)) {
			onlyLiteralValuesSupportedHereCtor();
			throw new Error();
		}

		for (const property of node.properties) {
			if (isPropertyAssignment(property)) {
				hostAttributes[this.codeAnalyzer.propertyNameService.getName(property.name)] = this.takeExpressionValue(property.initializer, invalidHostAttributesDecoratorUsageCtor, onlyLiteralValuesSupportedHereCtor);
			}

			else if (isShorthandPropertyAssignment(property)) {
				// Shorthand's are not supported currently since we only handle literal values
				onlyLiteralValuesSupportedHereCtor();
				throw new Error();
			}

			else if (isSpreadAssignment(property)) {
				// Spread assignments are not supported currently since we only handle literal values
				onlyLiteralValuesSupportedHereCtor();
				throw new Error();
			}

			else if (isMethodDeclaration(property)) {
				// It doesn't make sense to add method declarations to @hostAttributes
				invalidHostAttributesDecoratorUsageCtor();
				throw new Error();
			}

			else if (isAccessor(property)) {
				// It doesn't make sense to add method accessors to @hostAttributes
				invalidHostAttributesDecoratorUsageCtor();
				throw new Error();
			}
		}

		return hostAttributes;
	}

	/**
	 * Handles an Expression and attempts to retrieve a value from it
	 * @param {Expression} expression
	 * @param {() => void} invalidHostAttributesDecoratorUsageCtor
	 * @param {() => void} onlyLiteralValuesSupportedHereCtor
	 */
	private takeExpressionValue (expression: Expression, invalidHostAttributesDecoratorUsageCtor: () => void, onlyLiteralValuesSupportedHereCtor: () => void): Json {
		if (expression.kind === SyntaxKind.TrueKeyword) return true;
		else if (expression.kind === SyntaxKind.FalseKeyword) return false;
		else if (expression.kind === SyntaxKind.NullKeyword) return null;
		else if (expression.kind === SyntaxKind.UndefinedKeyword) return undefined;

		if (isStringLiteral(expression) || isNoSubstitutionTemplateLiteral(expression)) {
			return expression.text;
		}

		else if (isTemplateLiteral(expression)) {
			return this.codeAnalyzer.templateExpressionService.stringify(expression);
		}

		else if (isNumericLiteral(expression)) {
			return parseFloat(expression.text);
		}

		else if (isRegularExpressionLiteral(expression)) {
			const flags = expression.text.replace(/.*\/([gimyus]*)$/, "$1");
			const pattern = expression.text.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1");
			return new RegExp(pattern, flags);
		}

		else if (isObjectLiteralExpression(expression)) {
			return this.parseRawHostAttributeValues(expression, invalidHostAttributesDecoratorUsageCtor, onlyLiteralValuesSupportedHereCtor);
		}

		// The value is not supported.
		else {
			onlyLiteralValuesSupportedHereCtor();
		}
	}
}