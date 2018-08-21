import {IHostListenerExtractor} from "./i-host-listener-extractor";
import {IHostListenerExtractorExtractOptions} from "./i-host-listener-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract methods annotated with a @listener decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class HostListenerExtractor implements IHostListenerExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @listener decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.listenerDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @listener decorator and delegates it to the fovea-lib helper '___registerListener'.
	 * @param {IHostListenerExtractorExtractOptions} options
	 */
	public extract (options: IHostListenerExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@listener" decorator
		const listenerInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, mark.classDeclaration);
		const listenerStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, mark.classDeclaration);

		// Take all methods
		const allMethods = [...listenerInstanceMethods, ...listenerStaticMethods];

		// Store all calls to 'registerListener' here
		const registerListenerCalls: string[] = [];

		// For each method, generate a call to '___registerListener' and remove the '@listener' decorator
		allMethods.forEach(listenerMethod => {
			// Take all decorators
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, listenerMethod);

			decorators.forEach(decorator => {
				// The emit contents will either be empty if @listener() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
				if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {

					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_HOST_LISTENER_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(listenerMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return;
				}

				// The first argument will be the event name(s) to listen for
				const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

				// The second - optional - argument will be a configuration for the listener
				const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;

				// If we're on a dry run, return true before mutating the SourceFile
				if (compilerOptions.dryRun) return;

				registerListenerCalls.push(`${this.libUser.use("registerListener", compilerOptions, context)}(this, "${this.codeAnalyzer.propertyNameService.getName(listenerMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(listenerMethod)}, ${firstArgumentContents}${secondArgumentContents});`);

				// Remove the @listener decorator from it
				context.container.remove(decorator.pos, decorator.end);
			});
		});

		// If there is at least 1 host listener, add the prototype method
		if (registerListenerCalls.length > 0) {

			if (!compilerOptions.dryRun) {

				const registerBody = (
					this.foveaHostUtil.isBaseComponent(classDeclaration)
						? `\n		${registerListenerCalls.join("\n		")}`
						: `\n		// ts-ignore` +
						`\n		if (super.${this.configuration.postCompile.registerListenersMethodName} != null) super.${this.configuration.postCompile.registerListenersMethodName}();` +
						`\n		${registerListenerCalls.join("\n		")}`
				);

				const connectBody = (
					`\n		${this.libUser.use("connectListeners", compilerOptions, context)}(this);`
				);

				const disposeBody = (
					`\n		${this.libUser.use("disposeListeners", compilerOptions, context)}(this);`
				);

				// Create the register method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerListenersMethodName} (): void {` +
					`${registerBody}` +
					`\n	}`
				);

				// Create the connect method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.connectListenersMethodName} (): void {` +
					`${connectBody}` +
					`\n	}`
				);

				// Create the dispose method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected ${this.configuration.postCompile.disposeListenersMethodName} (): void {` +
					`${disposeBody}` +
					`\n	}`
				);

				// Add an instruction to invoke the static method
				context.container.appendAtPlacement(
					`\n${className}.${this.configuration.postCompile.registerListenersMethodName}();`,
					insertPlacement
				);
			}
		}

		// Set 'hasHostListeners' to true if there were any '___registerListener' instructions, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasHostListeners(context.container.file, statsForFile.hasHostListeners || registerListenerCalls.length > 0);
	}
}