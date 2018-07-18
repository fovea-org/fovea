import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {isCallExpression} from "typescript";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {IChildListObserverExtractor} from "./i-child-list-observer-extractor";
import {IChildListObserverExtractorExtractOptions} from "./i-child-list-observer-extractor-extract-options";

/**
 * A class that can extract methods annotated with a @onChildrenAdded or @onChildrenRemoved decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class ChildListObserverExtractor implements IChildListObserverExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @onChildrenAdded decorators
	 * @returns {RegExp}
	 */
	private get onChildrenAddedDecoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onChildrenAddedDecoratorName}`);
	}

	/**
	 * Gets a Regular Expression that matches the name of @onChildrenRemoved decorators
	 * @returns {RegExp}
	 */
	private get onChildrenRemovedDecoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onChildrenRemovedDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @onChildrenAdded or @onChildrenRemoved decorator and delegates it to the fovea-lib helper '__registerChildListObserver'.
	 * @param {IChildListObserverExtractorExtractOptions} options
	 */
	public extract (options: IChildListObserverExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;
		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onChildrenAdded" decorator
		const onChildrenAddedInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.onChildrenAddedDecoratorNameRegex, classDeclaration).map(method => ({method, added: true}));
		const onChildrenAddedStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.onChildrenAddedDecoratorNameRegex, classDeclaration).map(method => ({method, added: true}));

		// Take all methods that has a "@onChildrenRemoved" decorator
		const onChildrenRemovedInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.onChildrenRemovedDecoratorNameRegex, classDeclaration).map(method => ({method, added: false}));
		const onChildrenRemovedStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.onChildrenRemovedDecoratorNameRegex, classDeclaration).map(method => ({method, added: false}));

		// Take all methods
		const allMethods = [...onChildrenAddedInstanceMethods, ...onChildrenAddedStaticMethods, ...onChildrenRemovedInstanceMethods, ...onChildrenRemovedStaticMethods];

		// For each method, generate a call to '__registerChildListObserver' and remove the '@[onChildrenAdded|onChildrenRemoved]' decorator
		const results = allMethods.map(({method, added}) => {

			// Take the relevant decorator name
			const decoratorName = added ? this.onChildrenAddedDecoratorNameRegex : this.onChildrenRemovedDecoratorNameRegex;

			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(decoratorName, method);

			const decoratorResults = decorators.map(decorator => {
				// The contents will either be empty if @[onChildrenAdded|onChildrenRemoved]() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				if (!isCallExpression(decorator.expression)) {

					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_CHILD_LIST_OBSERVER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(method), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return false;
				}

				// The first - optional - argument will be a configuration for the mutation observer
				const argumentContents = decorator.expression.arguments.length < 1 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[0])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return true;

				// Create the CallExpression
				context.container.appendAtPlacement(
					`\n${this.libUser.use("registerChildListObserver", compilerOptions, context)}(<any>${className}, "${this.codeAnalyzer.propertyNameService.getName(method.name)}", ${this.codeAnalyzer.modifierService.isStatic(method)}, ${added}${argumentContents});`,
					insertPlacement
				);

				// Remove the @onChildrenAdded or @onChildrenRemoved decorator from it
				context.container.remove(decorator.pos, decorator.end);
				return true;
			});
			return decoratorResults.some(result => result);
		});
		// Set 'hasChildListObservers' to true if there were any results and any of them were 'true', or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasChildListObservers(context.container.file, statsForFile.hasChildListObservers || results.some(result => result));
	}
}