import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IOnAttributeChangeExtractor} from "./i-on-attribute-change-extractor";
import {IOnAttributeChangeExtractorExtractOptions} from "./i-on-attribute-change-extractor-extract-options";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract methods annotated with a @onAttributeChange decorator from a Component prototype and invoke the helpers in @fovea/lib
 */
export class OnAttributeChangeExtractor implements IOnAttributeChangeExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @onAttributeChange decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onAttributeChangeDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @onAttributeChange decorator and delegates it to the @fovea/lib helper '___registerAttributeChangeObserver'.
	 * @param {IOnAttributeChangeExtractorExtractOptions} options
	 */
	public extract (options: IOnAttributeChangeExtractorExtractOptions): void {
		const {mark, context, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onAttributeChange" decorator
		const onAttributeChangeInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);
		const onAttributeChangeStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);

		// Take all methods
		const allMethods = [...onAttributeChangeInstanceMethods, ...onAttributeChangeStaticMethods];

		// Store all calls to 'registerAttributeChangeObserver' here
		const registerAttributeChangeObserverCalls: string[] = [];

		// For each method, generate a call to '___registerAttributeChangeObserver' and remove the '@onAttributeChange' decorator
		allMethods.forEach(onAttributeChangeMethod => {
			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, onAttributeChangeMethod);
			decorators.forEach(decorator => {
				// Make sure that it is provided with at least 1 argument
				if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {
					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_ATTRIBUTE_OBSERVER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(onAttributeChangeMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return;
				}

				// The first argument will be the prop name(s) to observe
				const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

				// The second - optional - argument will be a configuration object for the attribute observer
				const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return;

				registerAttributeChangeObserverCalls.push(`${this.libUser.use("registerAttributeChangeObserver", compilerOptions, context)}(this, "${this.codeAnalyzer.propertyNameService.getName(onAttributeChangeMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(onAttributeChangeMethod)}, ${firstArgumentContents}${secondArgumentContents});`);

				// Remove the @onAttributeChange decorator from it
				context.container.remove(decorator.pos, decorator.end);
			});
		});

		// If there is at least 1 attribute change observer, add the prototype method
		if (registerAttributeChangeObserverCalls.length > 0) {

			if (!compilerOptions.dryRun) {

				const registerBody = (
					this.foveaHostUtil.isBaseComponent(classDeclaration)
						? `\n		${registerAttributeChangeObserverCalls.join("\n		")}`
						: `\n		// ts-ignore` +
						`\n		if (super.${this.configuration.postCompile.registerAttributeChangeObserversMethodName} != null) super.${this.configuration.postCompile.registerAttributeChangeObserversMethodName}();` +
						`\n		${registerAttributeChangeObserverCalls.join("\n		")}`
				);

				const connectBody = (
					`\n		${this.libUser.use("connectAttributeChangeObservers", compilerOptions, context)}(this);`
				);

				const disposeBody = (
					`\n		${this.libUser.use("disposeAttributeChangeObservers", compilerOptions, context)}(this);`
				);

				// Create the register method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerAttributeChangeObserversMethodName} (): void {` +
					`${registerBody}` +
					`\n	}`
				);

				// Create the connect method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.connectAttributeChangeObserversMethodName} (): void {` +
					`${connectBody}` +
					`\n	}`
				);

				// Create the dispose method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.disposeAttributeChangeObserversMethodName} (): void {` +
					`${disposeBody}` +
					`\n	}`
				);
			}
		}

		// Set 'hasAttributeChangeObservers' to true if there were any results, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasAttributeChangeObservers(context.container.file, statsForFile.hasAttributeChangeObservers || registerAttributeChangeObserverCalls.length > 0);
	}
}