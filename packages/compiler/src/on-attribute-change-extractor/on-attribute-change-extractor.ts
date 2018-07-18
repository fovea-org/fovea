import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IOnAttributeChangeExtractor} from "./i-on-attribute-change-extractor";
import {IOnAttributeChangeExtractorExtractOptions} from "./i-on-attribute-change-extractor-extract-options";

/**
 * A class that can extract methods annotated with a @onAttributeChange decorator from a Component prototype and invoke the helpers in @fovea/lib
 */
export class OnAttributeChangeExtractor implements IOnAttributeChangeExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @onAttributeChange decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onAttributeChangeDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @onAttributeChange decorator and delegates it to the @fovea/lib helper '__registerAttributeChangeObserver'.
	 * @param {IOnAttributeChangeExtractorExtractOptions} options
	 */
	public extract (options: IOnAttributeChangeExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onAttributeChange" decorator
		const onAttributeChangeInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);
		const onAttributeChangeStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);

		// Take all methods
		const allMethods = [...onAttributeChangeInstanceMethods, ...onAttributeChangeStaticMethods];

		// For each method, generate a call to '__registerAttributeChangeObserver' and remove the '@onAttributeChange' decorator
		const results = allMethods.map(onAttributeChangeMethod => {
			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, onAttributeChangeMethod);
			const decoratorResults = decorators.map(decorator => {
				// Make sure that it is provided with at least 1 argument
				if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {
					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_ATTRIBUTE_OBSERVER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(onAttributeChangeMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return false;
				}

				// The first argument will be the prop name(s) to observe
				const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

				// The second - optional - argument will be a configuration object for the attribute observer
				const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return true;

				// Create the CallExpression
				context.container.appendAtPlacement(
					`\n${this.libUser.use("registerAttributeChangeObserver", compilerOptions, context)}(<any>${className}, "${this.codeAnalyzer.propertyNameService.getName(onAttributeChangeMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(onAttributeChangeMethod)}, ${firstArgumentContents}${secondArgumentContents});`,
					insertPlacement
				);

				// Remove the @onAttributeChange decorator from it
				context.container.remove(decorator.pos, decorator.end);
				return true;
			});
			return decoratorResults.some(result => result);
		});
		// Set 'hasAttributeChangeObservers' to true if there were any results and any of them were 'true', or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasAttributeChangeObservers(context.container.file, statsForFile.hasAttributeChangeObservers || results.some(result => result));
	}
}