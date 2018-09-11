import {ITemplator, RegisterMethod} from "./i-templator";
import {IFoveaDOM} from "@fovea/dom";
import {ITemplatorGenerateOptions} from "./i-templator-generate-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ILibUser} from "../lib-user/i-lib-user";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ClassElement, Decorator, Expression, isCallExpression, isGetAccessorDeclaration, isMethodDeclaration, isPropertyDeclaration, isStringLiteral, isTemplateLiteral, SyntaxKind} from "typescript";
import {IModuleUtil} from "@wessberg/moduleutil";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {IInvalidSrcDecoratorUsageFoveaDiagnosticCtor} from "../diagnostics/fovea-diagnostic-ctor";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IRegisterResult} from "./i-register-result";
import {IHashUtil} from "../util/hash-util/i-hash-util";
import {IFoveaStyles} from "@fovea/style";
import {IUseItem, LibHelperName} from "@fovea/common";
import {ITemplatorUseOptions} from "./i-templator-use-options";
import {ITemplatorRegisterOptions} from "./i-templator-register-options";
import {containsOnlyWhitespace, isEmpty} from "@wessberg/stringutil";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that generates template instructions to a Fovea component
 */
export class Templator implements ITemplator {

	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly moduleUtil: IModuleUtil,
							 private readonly hashUtil: IHashUtil,
							 private readonly foveaDOM: IFoveaDOM,
							 private readonly foveaStyles: IFoveaStyles,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Generates template instructions. Can receive a template from a decorator or from a 'template' method on the component prototype.
	 * @param {ITemplatorGenerateOptions} options
	 * @returns {Promise<void>}
	 */
	public async generateTemplates (options: ITemplatorGenerateOptions): Promise<void> {
		await this.generate(
			options,
			this.configuration.preCompile.templateSrcDecoratorName,
			this.configuration.postCompile.useTemplatesMethodName,
			this.configuration.postCompile.connectTemplatesMethodName,
			this.configuration.postCompile.disposeTemplatesMethodName,
			this.configuration.postCompile.destroyTemplatesMethodName,
			"connectTemplates",
			"disposeTemplates",
			"destroyTemplates",
			this.configuration.preCompile.templateName,
			this.registerTemplate
		);
	}

	/**
	 * Generates style instructions. Can receive styles from a decorator or from a prototype method. Supports .css and .scss
	 * It is also possible to data-bind directly within the styles.
	 * @param {ITemplatorGenerateOptions} options
	 */
	public async generateStyles (options: ITemplatorGenerateOptions): Promise<void> {
		await this.generate(
			options,
			this.configuration.preCompile.styleSrcDecoratorName,
			this.configuration.postCompile.useCSSMethodName,
			this.configuration.postCompile.connectCSSMethodName,
			this.configuration.postCompile.disposeCSSMethodName,
			null,
			"connectCSS",
			"disposeCSS",
			null,
			this.configuration.preCompile.stylesName,
			this.registerStyles
		);
	}

	/**
	 * Generates the template instructions and sets them on the SourceFile
	 * @param {ITemplatorRegisterOptions} options
	 * @param {string} content
	 * @param {string} resolvedPath
	 * @returns {Promise<IRegisterResult>}
	 */
	public async registerTemplate (options: ITemplatorRegisterOptions, content: string, resolvedPath: string): Promise<IRegisterResult> {
		const {context, insertPlacement, compilerOptions, generateForStyles = false, shouldExport = false} = options;

		// Initialize the array of generated hashes
		const generatedHashes: IUseItem[] = [];

		try {
			// Generate DOM instructions for the class. Skip style tags and pass them on to the style generator
			const {requiredHelpers, instructions, amount, skippedParts, referencedCustomSelectors, ...stats} = this.foveaDOM.generate({template: content, dryRun: compilerOptions.dryRun, skipTags: new Set(generateForStyles ? [] : ["style"])});

			// Take the existing stats for the file. Another component inside of it may already have been registered and added stats for it
			const statsForFile = this.stats.getStatsForFile(context.container.file);

			// Add the IFoveaStats for the file
			this.stats.setHasSyncEvaluations(context.container.file, stats.hasSyncEvaluations || statsForFile.hasSyncEvaluations);
			this.stats.setHasAsyncEvaluations(context.container.file, stats.hasAsyncEvaluations || statsForFile.hasAsyncEvaluations);
			this.stats.setHasTemplateListeners(context.container.file, stats.hasTemplateListeners || statsForFile.hasTemplateListeners);
			this.stats.setHasTemplateCustomAttributes(context.container.file, stats.hasTemplateCustomAttributes || statsForFile.hasTemplateCustomAttributes);
			this.stats.setHasTemplateRefs(context.container.file, stats.hasTemplateRefs || statsForFile.hasTemplateRefs);
			this.stats.setHasTemplateAttributes(context.container.file, stats.hasTemplateAttributes || statsForFile.hasTemplateAttributes);
			this.stats.setReferencedCustomSelectors(context.container.file, [...referencedCustomSelectors, ...statsForFile.referencedCustomSelectors]);

			// Mark all required helpers as used
			this.libUser.markAsUsed(requiredHelpers, compilerOptions, context);

			if (amount > 0) {
				// Generate a hash
				const hash = this.generateTemplateHash(resolvedPath);
				generatedHashes.push(["template", hash]);

				// Call the fovea-lib helper method '__registerTemplate' with the template instructions and the Component prototype to map them to.
				if (!compilerOptions.dryRun) {
					const expression = `\n${this.libUser.use("registerStaticTemplate", compilerOptions, context)}(() => {${instructions.split("\n").map(line => `	${line}`).join("\n")}\n}, "${hash}");`;
					insertPlacement != null
						? context.container.appendAtPlacement(expression, insertPlacement)
						: context.container.prepend(expression);
				}
			}

			// Add styles for all of the skipped style tags
			for (const skippedPart of skippedParts) {
				const stylesResult = await this.registerStyles({
					context,
					insertPlacement,
					compilerOptions,
					shouldExport: false
				}, skippedPart.inner, resolvedPath);

				// Add all of the generated style hashes to the set of total generated hashes
				generatedHashes.push(...stylesResult.generatedHashes);
			}
		}

		catch (ex) {
			this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_TEMPLATE, formattedErrorMessage: ex.toString()});
		}

		if (!compilerOptions.dryRun && shouldExport) {
			context.container.append(`\nexport const ${this.generateExportScopeName(resolvedPath)} = ${JSON.stringify(generatedHashes)};`);
		}

		return {
			generatedHashes
		};
	}

	/**
	 * Generates the style instructions and sets them on the SourceFile
	 * @param {ITemplatorRegisterOptions} options
	 * @param {string} content
	 * @param {string} resolvedPath
	 * @returns {IRegisterResult}
	 */
	public async registerStyles (options: ITemplatorRegisterOptions, content: string, resolvedPath: string): Promise<IRegisterResult> {
		const {context, insertPlacement, compilerOptions, shouldExport = false} = options;

		let hasInstanceCSS: boolean = false;
		let hasStaticCSS: boolean = false;

		// Initialize the array of generated hashes
		const generatedHashes: IUseItem[] = [];

		// Take the existing stats for the file. Another component inside of it may already have been registered and added stats for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);

		try {
			// Generate style instructions for the class
			const {instanceCSS, staticCSS} = await this.foveaStyles.generate({
				template: content,
				file: resolvedPath,
				production: compilerOptions.production,
				postCSSPlugins: compilerOptions.postcss == null || compilerOptions.postcss.plugins == null ? undefined : compilerOptions.postcss.plugins,
				pluginConfigurationHook: compilerOptions.postcss == null || compilerOptions.postcss.hook == null ? undefined : compilerOptions.postcss.hook
			});

			// Resolve all imports of the file and mark them as dependencies
			const {paths} = await this.foveaStyles.takeImportPaths({file: resolvedPath, template: content});
			this.stats.setFileDependencies(context.container.file, [...paths, ...statsForFile.fileDependencies]);

			hasInstanceCSS = instanceCSS != null && !isEmpty(instanceCSS) && !containsOnlyWhitespace(instanceCSS);
			hasStaticCSS = staticCSS != null && !isEmpty(staticCSS) && !containsOnlyWhitespace(staticCSS);

			// For the instance styles, generate them as template contents to hook into the data-binding system
			if (hasInstanceCSS) {
				const templateResult = await this.registerTemplate({
					context,
					compilerOptions,
					insertPlacement,
					generateForStyles: true,
					shouldExport: false
				}, `<style>${instanceCSS}</style>`, resolvedPath);

				// Add all of the generated template hashes to the set of total generated hashes
				generatedHashes.push(...templateResult.generatedHashes);
			}

			// For the static styles, generate call to '___registerStaticCSS' with the styles unless it has them already or unless they are empty!
			if (hasStaticCSS) {
				// Generate a hash
				const hash = this.generateStylesHash(resolvedPath);

				// Add its hash to the set of generated hashes
				generatedHashes.push(["styles", hash]);

				if (!compilerOptions.dryRun) {
					const expression = `\n${this.libUser.use("registerStaticCSS", compilerOptions, context)}(${JSON.stringify(staticCSS)}, "${hash}");`;
					insertPlacement != null
						? context.container.appendAtPlacement(expression, insertPlacement)
						: context.container.prepend(expression);
				}
			}

		} catch (ex) {
			this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_CSS, formattedErrorMessage: ex.toString()});
		}

		this.stats.setHasStaticCSS(context.container.file, hasStaticCSS || statsForFile.hasStaticCSS);

		if (!compilerOptions.dryRun && shouldExport) {
			context.container.append(`\nexport const ${this.generateExportScopeName(resolvedPath)} = ${JSON.stringify(generatedHashes)};`);
		}

		return {
			generatedHashes
		};
	}

	/**
	 * Generates a hash for a resolved path to some styles
	 * @param resolvedPath
	 * @returns {string}
	 */
	public generateStylesHash (resolvedPath: string): string {
		return this.hashUtil.generate(`${resolvedPath}styles`);
	}

	/**
	 * Generates a hash for a resolved path to some template.
	 * It must be unique to every class since the template will change depending on the
	 * properties of the component class
	 * @param {string} resolvedPath
	 * @returns {string}
	 */
	public generateTemplateHash (resolvedPath: string): string {
		return this.hashUtil.generate(`${resolvedPath}template`);
	}

	/**
	 * Generates a scope name. This scope will be equal to a named export of a file containing templates and/or styles
	 * @param {string} providerPath
	 * @returns {string}
	 */
	public generateExportScopeName (providerPath: string): string {
		return `_${this.hashUtil.generate(`${providerPath}`)}`;
	}

	/**
	 * Generates instructions to use all of the provided hashes
	 * @param {ITemplatorUseOptions} options
	 * @param {IUseItem[]} items
	 * @returns {string}
	 */
	public use (options: ITemplatorUseOptions, items: IUseItem[]): string {
		const {compilerOptions, context} = options;

		// Generate the 'use' instruction
		return `${this.libUser.use("use", compilerOptions, context)}(this, ${JSON.stringify(items)});`;
	}

	/**
	 * Generates instructions to use either templates or styles from the path given as an argument
	 * @param {ITemplatorUseOptions} options
	 * @param {string} resolvedPath
	 * @returns {string}
	 */
	public useForeign (options: ITemplatorUseOptions, resolvedPath: string): string {
		const {compilerOptions, context} = options;
		const scopeName = this.generateExportScopeName(resolvedPath);

		const isSamePath = resolvedPath === context.container.file;

		// If we're not using a template or some styles from the same SourceFile, check if it already imports it and if not, add an import
		if (!isSamePath) {

			// Take the existing stats for the file. Another component inside of it may already have been registered and added stats for it
			const statsForFile = this.stats.getStatsForFile(context.container.file);
			this.stats.setFileDependencies(context.container.file, [resolvedPath, ...statsForFile.fileDependencies]);

			// Import the module we want to use
			if (!compilerOptions.dryRun) {
				context.container.prepend(`\n// @ts-ignore\nimport {${scopeName}} from "${resolvedPath}";\n`);
			}
		}

		// Return the 'use' instruction
		return `${this.libUser.use("use", compilerOptions, context)}(this, ${scopeName});`;
	}

	/**
	 * Generates either template or style instructions, depending on the provided arguments
	 * @param {ITemplatorGenerateOptions} options
	 * @param {string} srcDecoratorName
	 * @param {string} staticUseMethodName
	 * @param {string} connectMethodName
	 * @param {string} disposeMethodName
	 * @param {string|null} destroyMethodName
	 * @param {LibHelperName} connectHelperName
	 * @param {LibHelperName} disposeHelperName
	 * @param {LibHelperName|null} destroyHelperName
	 * @param {string} propertyName
	 * @param {RegisterMethod} registerMethod
	 * @returns {Promise<void>}
	 */
	private async generate (options: ITemplatorGenerateOptions, srcDecoratorName: string, staticUseMethodName: string, connectMethodName: string, disposeMethodName: string, destroyMethodName: string|null, connectHelperName: LibHelperName, disposeHelperName: LibHelperName, destroyHelperName: LibHelperName|null, propertyName: string, registerMethod: RegisterMethod): Promise<void> {
		const {mark, compilerOptions, context} = options;

		// First, check if the class is annotated with a [template|style]Src decorator
		const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(new RegExp(`^${srcDecoratorName}`), mark.classDeclaration);

		// Store all calls to 'use' here
		const useCalls: string[] = [];

		decorators.forEach(decorator => {
			// Generate template or style contents from the decorator
			useCalls.push(...this.generateFromDecorator(options, decorator));

			// Remove the decorator. We are done with it
			if (!compilerOptions.dryRun) {
				context.container.remove(decorator.pos, decorator.end);
			}
		});

		// Also try to find the '[template|styles]' property on the class declaration
		const property = this.codeAnalyzer.classService.getMemberWithName(propertyName, mark.classDeclaration);

		// If it has a [template|styles] property/method/accessor
		if (property != null) {
			useCalls.push(...(await this.generateFromProperty(options, property, registerMethod)));

			// Remove the user-provided '[template|styles]' property from the class. We're done with it!
			if (!compilerOptions.dryRun) {
				context.container.remove(property.pos, property.end);
			}
		}

		// If there is at least 1 'use' instruction, add the relevant methods
		if (useCalls.length > 0 && !compilerOptions.dryRun) {

			const useBody = (
				this.foveaHostUtil.isBaseComponent(mark.classDeclaration)
					? `\n		${useCalls.join("\n		")}`
					: `\n		// ts-ignore` +
					`\n		if (super.${staticUseMethodName} != null) super.${staticUseMethodName}();` +
					`\n		${useCalls.join("\n		")}`
			);

			const connectBody = (
				`\n		${this.libUser.use(connectHelperName, compilerOptions, context)}(this);`
			);

			const disposeBody = (
				`\n		${this.libUser.use(disposeHelperName, compilerOptions, context)}(this);`
			);

			// Create the "use" method
			context.container.appendLeft(
				mark.classDeclaration.members.end,
				`\n	protected static ${staticUseMethodName} (): void {` +
				`${useBody}` +
				`\n	}`
			);

			// Create the "connectTemplates|connectCSS" method
			context.container.appendLeft(
				mark.classDeclaration.members.end,
				`\n	protected ${connectMethodName} (): void {` +
				`${connectBody}` +
				`\n	}`
			);

			// Create the "disposeTemplates|disposeCSS" method
			context.container.appendLeft(
				mark.classDeclaration.members.end,
				`\n	protected ${disposeMethodName} (): void {` +
				`${disposeBody}` +
				`\n	}`
			);

			if (destroyHelperName != null && destroyMethodName != null) {
				const destroyBody = (
					`\n		${this.libUser.use(destroyHelperName, compilerOptions, context)}(this);`
				);

				// Create the "destroy" method
				context.container.appendLeft(
					mark.classDeclaration.members.end,
					`\n	protected ${destroyMethodName} (): void {` +
					`${destroyBody}` +
					`\n	}`
				);
			}
		}
	}

	/**
	 * Takes the paths of the given decorator and resolves them.
	 * @param {ITemplatorGenerateOptions} options
	 * @param {Decorator} decorator
	 * @returns {string[] | undefined}
	 */
	private takeResolvedPathsFromDecorator (options: ITemplatorGenerateOptions, decorator: Decorator): string[]|undefined {
		const {mark, context} = options;
		const decoratorContent = this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator);
		const diagnostic: IInvalidSrcDecoratorUsageFoveaDiagnosticCtor = {kind: FoveaDiagnosticKind.INVALID_SRC_DECORATOR_USAGE, hostKind: mark.kind, hostName: mark.className, decoratorContent};

		// If the expression of the decorator is not a CallExpression, there will be no src.
		if (!isCallExpression(decorator.expression)) {
			this.diagnostics.addDiagnostic(context.container.file, diagnostic);
			return;
		}

		// Take the first argument from the CallExpression
		const [firstArgument] = this.codeAnalyzer.callExpressionService.getArguments(decorator.expression);

		// If it has none, there will be no src
		if (firstArgument == null) {
			this.diagnostics.addDiagnostic(context.container.file, diagnostic);
			return;
		}

		// The first argument may either by a single string or an array of strings in which case all of them should be registered/used
		const evaluatedFirstArgument: string|string[] = new Function(`return ${firstArgument}`)();
		const normalizedPaths = Array.isArray(evaluatedFirstArgument) ? evaluatedFirstArgument : [evaluatedFirstArgument];
		const resolvedPaths: string[] = [];

		normalizedPaths.forEach(normalizedPath => {
			try {
				// Resolve the full path
				resolvedPaths.push(this.moduleUtil.resolvePath(normalizedPath, context.container.file));

			} catch (ex) {
				this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.UNRESOLVED_SRC, hostKind: mark.kind, hostName: mark.className, decoratorContent, path: normalizedPath});
			}
		});

		// Return the resolved paths
		return resolvedPaths;
	}

	/**
	 * Generates a template from a '@templateSrc("<url>") decorator on the component prototype
	 * @param {ITemplatorGenerateOptions} options
	 * @param {Decorator} decorator
	 * @returns {string[]}
	 */
	private generateFromDecorator (options: ITemplatorGenerateOptions, decorator: Decorator): string[] {
		// Take the path from the decorator
		const resolvedPaths = this.takeResolvedPathsFromDecorator(options, decorator);

		// If we retrieved a path from it, generate instructions to use the template from that path
		if (resolvedPaths != null) {
			return resolvedPaths.map(resolvedPath => {
				// Generate an instruction to use whatever contents will be generated
				return this.useForeign(options, resolvedPath);
			});
		}
		return [];
	}

	/**
	 * Takes the relevant contents of the given ClassElement
	 * @param {ClassElement} classElement
	 * @returns {string | undefined}
	 */
	private takeContentsOfClassElement (classElement: ClassElement): string|undefined {

		// If it is a GetAccessorDeclaration or a MethodDeclaration, retrieve the contents of its ReturnStatement
		if (isGetAccessorDeclaration(classElement) || isMethodDeclaration(classElement)) {
			// Locate a return statement within the GetAccessor
			const returnStatement = isGetAccessorDeclaration(classElement)
				? this.codeAnalyzer.getAccessorService.takeReturnStatement(classElement)
				: this.codeAnalyzer.methodService.takeReturnStatement(classElement);

			if (returnStatement != null) {
				return this.takeContents(returnStatement.expression);
			}
		}

		// Otherwise, if it is a PropertyDeclaration, take the template contents from its initializer
		else if (isPropertyDeclaration(classElement)) {
			return this.takeContents(classElement.initializer);
		}

		// Otherwise, fall back to undefined
		return undefined;
	}

	/**
	 * Generates instructions from a '[template|styles]' method on the class prototype
	 * @param {ITemplatorGenerateOptions} options
	 * @param {ClassElement} property
	 * @param {RegisterMethod} registerMethod
	 * @returns {Promise<string[]>}
	 */
	private async generateFromProperty (options: ITemplatorGenerateOptions, property: ClassElement, registerMethod: RegisterMethod): Promise<string[]> {
		const template = this.takeContentsOfClassElement(property);

		// If there are no initialized contents of the template or styles,
		if (template == null || template.length < 1) return [];

		// Generate the instructions
		const result = <IRegisterResult> await registerMethod.call(this, options, template, options.context.container.file);

		// Generate instructions to actually use the templates or styles.
		return [this.use(options, result.generatedHashes)];
	}

	/**
	 * Takes the template contents of a ReturnStatement
	 * @param {ReturnStatement?} statement
	 * @returns {string}
	 */
	private takeContents (statement: Expression|undefined|null): string|undefined {
		// If there is no expression whatsoever, return undefined
		if (statement == null) return undefined;

		if (
			statement.kind === SyntaxKind.TrueKeyword ||
			statement.kind === SyntaxKind.FalseKeyword ||
			statement.kind === SyntaxKind.RegularExpressionLiteral ||
			statement.kind === SyntaxKind.NumericLiteral ||
			statement.kind === SyntaxKind.NullKeyword ||
			statement.kind === SyntaxKind.UndefinedKeyword) {
			return undefined;
		}

		// If it is a StringLiteral or a template string, stringify it
		else if (
			isTemplateLiteral(statement) ||
			isStringLiteral(statement)
		) {
			return this.codeAnalyzer.templateExpressionService.stringify(statement);
		}

		// Fall back to 'undefined' for anything else
		return undefined;
	}

}