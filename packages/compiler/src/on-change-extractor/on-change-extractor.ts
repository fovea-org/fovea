import {IOnChangeExtractor} from "./i-on-change-extractor";
import {IOnChangeExtractorExtractOptions} from "./i-on-change-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract methods annotated with a @onChange decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class OnChangeExtractor implements IOnChangeExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @onChange decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.onChangeDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @onChange decorator and delegates it to the fovea-lib helper '__registerChangeObserver'.
	 * @param {IOnChangeExtractorExtractOptions} options
	 */
	public extract (options: IOnChangeExtractorExtractOptions): void {
		const {mark, context, insertPlacement, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onChange" decorator
		const onChangeInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);
		const onChangeStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);

		// Take all methods
		const allMethods = [...onChangeInstanceMethods, ...onChangeStaticMethods];

		// Store all calls to 'registerChangeObserver' here
		const registerChangeObserverCalls: string[] = [];

		allMethods.forEach(onChangeMethod => {
			// Take all decorators for the method
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, onChangeMethod);

			decorators.forEach(decorator => {
				// Make sure that it is provided with at least 1 argument
				if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {
					this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_ON_CHANGE_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(onChangeMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
					return false;
				}

				// The first argument will be the prop name(s) to observe
				const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

				// The second - optional - argument will be whether or not all props must be initialized before invoking it
				const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;
				registerChangeObserverCalls.push(`${this.libUser.use("registerChangeObserver", compilerOptions, context)}(<any>this, "${this.codeAnalyzer.propertyNameService.getName(onChangeMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(onChangeMethod)}, ${firstArgumentContents}${secondArgumentContents});`);

				// Remove the @onChange decorator from it
				context.container.remove(decorator.pos, decorator.end);
				return true;
			});
		});

		// If there is at least 1 change observer, add the prototype method
		if (registerChangeObserverCalls.length > 0) {

			const body = (
				this.foveaHostUtil.isBaseComponent(classDeclaration)
					? `\n		${registerChangeObserverCalls.join("\n		")}`
					: `\n		// ts-ignore` +
					`\n		if (super.${this.configuration.postCompile.registerChangeObserversMethodName} != null) super.${this.configuration.postCompile.registerChangeObserversMethodName}();` +
					`\n		${registerChangeObserverCalls.join("\n		")}`
			);

			if (!compilerOptions.dryRun) {

				// Create the static method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	protected static ${this.configuration.postCompile.registerChangeObserversMethodName} (): void {` +
					`${body}` +
					`\n	}`
				);

				// Add an instruction to invoke the static method
				context.container.appendAtPlacement(
					`\n${className}.${this.configuration.postCompile.registerChangeObserversMethodName}();`,
					insertPlacement
				);
			}
		}

		// Set 'hasChangeObservers' to true if there were any results and any of them were 'true', or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasChangeObservers(context.container.file, statsForFile.hasChangeObservers || registerChangeObserverCalls.length > 0);
	}
}