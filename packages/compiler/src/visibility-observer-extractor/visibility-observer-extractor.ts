import {IVisibilityObserverExtractor} from "./i-visibility-observer-extractor";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IVisibilityObserverExtractorExtractOptions} from "./i-visibility-observer-extractor-extract-options";
import {isCallExpression} from "typescript";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";

/**
 * A class that can extract methods annotated with a @onBecameVisible or @onBecameInvisible decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class VisibilityObserverExtractor implements IVisibilityObserverExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @onBecameVisible decorators
	 * @returns {RegExp}
	 */
	private get visibleDecoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onBecameVisibleDecoratorName}`);
	}

	/**
	 * Gets a Regular Expression that matches the name of @onBecameInvisible decorators
	 * @returns {RegExp}
	 */
	private get invisibleDecoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onBecameInvisibleDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @onBecameVisible or @onBecameInvisible decorator and delegates it to the fovea-lib helper '__registerVisibilityObserver'.
	 * @param {IVisibilityObserverExtractorExtractOptions} options
	 */
	public extract (options: IVisibilityObserverExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;
		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onBecameVisible" decorator
		const onBecameVisibleInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.visibleDecoratorNameRegex, classDeclaration).map(method => ({method, visible: true}));
		const onBecameVisibleStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.visibleDecoratorNameRegex, classDeclaration).map(method => ({method, visible: true}));

		// Take all methods that has a "@onBecameInvisible" decorator
		const onBecameInvisibleInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.invisibleDecoratorNameRegex, classDeclaration).map(method => ({method, visible: false}));
		const onBecameInvisibleStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.invisibleDecoratorNameRegex, classDeclaration).map(method => ({method, visible: false}));

		// Take all methods
		const allMethods = [...onBecameVisibleInstanceMethods, ...onBecameVisibleStaticMethods, ...onBecameInvisibleInstanceMethods, ...onBecameInvisibleStaticMethods];

		// For each method, generate a call to '__registerVisibilityObserver' and remove the '@[onBecameVisible|onBecameInvisible]' decorator
		const results = allMethods.map(({method, visible}) => {

			// Take the relevant decorator name
			const decoratorName = visible ? this.visibleDecoratorNameRegex : this.invisibleDecoratorNameRegex;

			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(decoratorName, method);
			const decoratorResults = decorators.map(decorator => {
				// The contents will either be empty if @[onBecameVisible|OnBecameInvisible]() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				if (!isCallExpression(decorator.expression)) {

					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_VISIBILITY_OBSERVER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(method), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return false;
				}

				// The first - optional - argument will be a configuration for the visibility observer
				const argumentContents = decorator.expression.arguments.length < 1 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[0])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return true;

				// Create the CallExpression
				context.container.appendAtPlacement(
					`\n${this.libUser.use("registerVisibilityObserver", compilerOptions, context)}(<any>${className}, "${this.codeAnalyzer.propertyNameService.getName(method.name)}", ${this.codeAnalyzer.modifierService.isStatic(method)}, ${visible}${argumentContents});`,
					insertPlacement
				);

				// Remove the @onBecameVisible or @onBecameInvisible decorator from it
				context.container.remove(decorator.pos, decorator.end);
				return true;
			});
			return decoratorResults.some(result => result);
		});
		// Set 'hasVisibilityObservers' to true if there were any results and any of them were 'true', or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasVisibilityObservers(context.container.file, statsForFile.hasVisibilityObservers || results.some(result => result));
	}
}