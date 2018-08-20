import {IHostListenerExtractor} from "./i-host-listener-extractor";
import {IHostListenerExtractorExtractOptions} from "./i-host-listener-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";

/**
 * A class that can extract methods annotated with a @hostListener decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class HostListenerExtractor implements IHostListenerExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @hostListener decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.hostListenerDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @hostListener decorator and delegates it to the fovea-lib helper '__registerHostListener'.
	 * @param {IHostListenerExtractorExtractOptions} options
	 */
	public extract (options: IHostListenerExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@hostListener" decorator
		const hostListenerInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, mark.classDeclaration);
		const hostListenerStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, mark.classDeclaration);

		// Take all methods
		const allMethods = [...hostListenerInstanceMethods, ...hostListenerStaticMethods];

		// Store all calls to 'registerHostListener' here
		const registerHostListenerCalls: string[] = [];

		// For each method, generate a call to '__registerHostListener' and remove the '@hostListener' decorator
		allMethods.forEach(hostListenerMethod => {
			// Take all decorators
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, hostListenerMethod);

			decorators.forEach(decorator => {
				// The emit contents will either be empty if @hostListener() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {

					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_HOST_LISTENER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(hostListenerMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return;
				}

				// The first argument will be the event name(s) to listen for
				const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

				// The second - optional - argument will be a configuration for the listener
				const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return;

				registerHostListenerCalls.push(`${this.libUser.use("registerHostListener", compilerOptions, context)}(<any>this, "${this.codeAnalyzer.propertyNameService.getName(hostListenerMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(hostListenerMethod)}, ${firstArgumentContents}${secondArgumentContents});`);

				// Remove the @listener decorator from it
				context.container.remove(decorator.pos, decorator.end);
			});
		});

		// If there is at least 1 host listener, add the prototype method
		if (registerHostListenerCalls.length > 0) {

			const body = (
				`\n		// ts-ignore` +
				`\n		if (super.${this.configuration.postCompile.registerHostListenersMethodName} != null) super.${this.configuration.postCompile.registerHostListenersMethodName}();` +
				`\n		${registerHostListenerCalls.join("\n		")}`
			);

			if (!compilerOptions.dryRun) {

				// Create the static method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerHostListenersMethodName} (): void {` +
					`${body}` +
					`\n	}`
				);

				// Add an instruction to invoke the static method
				context.container.appendAtPlacement(
					`\n${className}.${this.configuration.postCompile.registerHostListenersMethodName}();`,
					insertPlacement
				);
			}
		}

		// Set 'hasHostListeners' to true if there were any '___registerHostListener' instructions, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasHostListeners(context.container.file, statsForFile.hasHostListeners || registerHostListenerCalls.length > 0);
	}
}