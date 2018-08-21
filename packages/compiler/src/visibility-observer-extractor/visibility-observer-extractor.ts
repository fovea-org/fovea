import {IVisibilityObserverExtractor} from "./i-visibility-observer-extractor";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IVisibilityObserverExtractorExtractOptions} from "./i-visibility-observer-extractor-extract-options";
import {isCallExpression} from "typescript";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract methods annotated with a @onBecameVisible or @onBecameInvisible decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class VisibilityObserverExtractor implements IVisibilityObserverExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
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
	 * Extracts all properties decorated with a @onBecameVisible or @onBecameInvisible decorator and delegates it to the fovea-lib helper '___registerVisibilityObserver'.
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

		// Store all calls to 'registerVisibilityObserver' here
		const registerVisibilityObserverCalls: string[] = [];

		// For each method, generate a call to '___registerVisibilityObserver' and remove the '@[onBecameVisible|onBecameInvisible]' decorator
		allMethods.forEach(({method, visible}) => {

			// Take the relevant decorator name
			const decoratorName = visible ? this.visibleDecoratorNameRegex : this.invisibleDecoratorNameRegex;

			// Take the decorator
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(decoratorName, method);
			decorators.forEach(decorator => {
				// The contents will either be empty if @[onBecameVisible|OnBecameInvisible]() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				if (!isCallExpression(decorator.expression)) {

					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_VISIBILITY_OBSERVER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(method), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return;
				}

				// The first - optional - argument will be a configuration for the visibility observer
				const argumentContents = decorator.expression.arguments.length < 1 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[0])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return;

				registerVisibilityObserverCalls.push(`${this.libUser.use("registerVisibilityObserver", compilerOptions, context)}(this, "${this.codeAnalyzer.propertyNameService.getName(method.name)}", ${this.codeAnalyzer.modifierService.isStatic(method)}, ${visible}${argumentContents});`);

				// Remove the @onBecameVisible or @onBecameInvisible decorator from it
				context.container.remove(decorator.pos, decorator.end);
				return true;
			});
		});

		// If there is at least 1 visibility observer, add the prototype method
		if (registerVisibilityObserverCalls.length > 0) {

			if (!compilerOptions.dryRun) {

				const registerBody = (
					this.foveaHostUtil.isBaseComponent(classDeclaration)
						? `\n		${registerVisibilityObserverCalls.join("\n		")}`
						: `\n		// ts-ignore` +
						`\n		if (super.${this.configuration.postCompile.registerVisibilityObserversMethodName} != null) super.${this.configuration.postCompile.registerVisibilityObserversMethodName}();` +
						`\n		${registerVisibilityObserverCalls.join("\n		")}`
				);

				const connectBody = (
					`\n		${this.libUser.use("connectVisibilityObservers", compilerOptions, context)}(this);`
				);

				const disposeBody = (
					`\n		${this.libUser.use("disposeVisibilityObservers", compilerOptions, context)}(this);`
				);

				// Create the register method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerVisibilityObserversMethodName} (): void {` +
					`${registerBody}` +
					`\n	}`
				);

				// Create the 'connect' method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.connectVisibilityObserversMethodName} (): void {` +
					`${connectBody}` +
					`\n	}`
				);

				// Create the 'dispose' method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.disposeVisibilityObserversMethodName} (): void {` +
					`${disposeBody}` +
					`\n	}`
				);

				// Add an instruction to invoke the static method
				context.container.appendAtPlacement(
					`\n${className}.${this.configuration.postCompile.registerVisibilityObserversMethodName}();`,
					insertPlacement
				);
			}
		}

		// Set 'hasVisibilityObservers' to true if there were any results, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasVisibilityObservers(context.container.file, statsForFile.hasVisibilityObservers || registerVisibilityObserverCalls.length > 0);
	}
}