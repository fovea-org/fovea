import {IOnChangeExtractor} from "./i-on-change-extractor";
import {IOnChangeExtractorExtractOptions} from "./i-on-change-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";

/**
 * A class that can extract methods annotated with a @onChange decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class OnChangeExtractor implements IOnChangeExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
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
		const {mark, insertPlacement, context, compilerOptions} = options;

		const {className, classDeclaration} = mark;

		// Take all methods that has a "@onChange" decorator
		const onChangeInstanceMethods = this.codeAnalyzer.classService.getMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);
		const onChangeStaticMethods = this.codeAnalyzer.classService.getStaticMethodsWithDecorator(this.decoratorNameRegex, classDeclaration);

		// Take all methods
		const allMethods = [...onChangeInstanceMethods, ...onChangeStaticMethods];

		// For each method, generate a call to '__registerChangeObserver' and remove the '@onChange' decorator
		const results = allMethods.map(onChangeMethod => {
			// Take the decorator
			const decorator = this.codeAnalyzer.decoratorService.getDecoratorWithExpression(this.decoratorNameRegex, onChangeMethod);
			// If, for some reason, the decorator couldn't be matched or it if isn't a CallExpression, return
			if (decorator == null) return false;

			// Make sure that it is provided with at least 1 argument
			if (!isCallExpression(decorator.expression) || decorator.expression.arguments.length < 1) {
				this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_ON_CHANGE_DECORATOR_USAGE, methodName: this.codeAnalyzer.methodService.getName(onChangeMethod), hostName: className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
				return false;
			}

			// The first argument will be the prop name(s) to observe
			const firstArgumentContents = this.codeAnalyzer.printer.print(decorator.expression.arguments[0]);

			// The second - optional - argument will be whether or not the observer should only be invoked when the host element is connected to the DOM
			const secondArgumentContents = decorator.expression.arguments.length < 2 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[1])}`;

			// The third - optional - argument will be whether or not all props must be initialized before invoking it
			const thirdArgumentContents = decorator.expression.arguments.length < 3 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[2])}`;

			// If we're on a dry run, return true before mutating the SourceFile
			if (compilerOptions.dryRun) return true;

			// Create the CallExpression
			context.container.appendAtPlacement(
				`\n${this.libUser.use("registerChangeObserver", compilerOptions, context)}(<any>${className}, "${this.codeAnalyzer.propertyNameService.getName(onChangeMethod.name)}", ${this.codeAnalyzer.modifierService.isStatic(onChangeMethod)}, ${firstArgumentContents}${secondArgumentContents}${thirdArgumentContents});`,
				insertPlacement
			);

			// Remove the @onChange decorator from it
			context.container.remove(decorator.pos, decorator.end);
			return true;
		});
		// Set 'hasChangeObservers' to true if there were any results and any of them were 'true'
		this.stats.setHasChangeObservers(context.container.file, results.some(result => result));
	}
}