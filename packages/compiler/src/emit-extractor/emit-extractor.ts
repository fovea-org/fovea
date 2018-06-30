import {IEmitExtractor} from "./i-emit-extractor";
import {IEmitExtractorExtractOptions} from "./i-emit-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {isCallExpression, PropertyDeclaration} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

/**
 * A class that can extract properties annotated with a @emit decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class EmitExtractor implements IEmitExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @emit decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.emitDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @emit decorator and delegates it to the fovea-lib helper '__registerEmitter'.
	 * @param {IEmitExtractorExtractOptions} options
	 */
	public extract (options: IEmitExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;

		const {className} = mark;

		// Take all props that has a "@emit" decorator
		const emitInstanceProperties = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.decoratorNameRegex, mark.classDeclaration);
		const emitStaticProperties = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.decoratorNameRegex, mark.classDeclaration);

		// Take all props
		const allProps = [...emitInstanceProperties, ...emitStaticProperties];

		// For each prop, generate a call to '__registerEmitter' and remove the '@emit' decorator
		const results = allProps.map(emitProperty => {
			// Take the decorator
			const decorator = this.codeAnalyzer.decoratorService.getDecoratorWithExpression(this.decoratorNameRegex, emitProperty);
			// If, for some reason, the decorator couldn't be matched or it if isn't a CallExpression, return
			if (decorator == null) return false;

			// If we're on a dry run, return true before performing the SourceFile mutations
			if (compilerOptions.dryRun) return true;

			// The emit contents will either be empty if @emit() takes no arguments or isn't a CallExpression, or it will be the contents of the first provided argument to it
			const emitContents = !isCallExpression(decorator.expression) || decorator.expression.arguments.length === 0 ? "" : `, ${this.codeAnalyzer.printer.print(decorator.expression.arguments[0])}`;

			// Create the CallExpression
			context.container.appendAtPlacement(
				`\n${this.libUser.use("registerEmitter", compilerOptions, context)}(<any>${className}, "${this.codeAnalyzer.propertyNameService.getName(emitProperty.name)}", ${this.codeAnalyzer.modifierService.isStatic(emitProperty)}${emitContents});`,
				insertPlacement
			);

			// Remove the @emit decorator from it
			context.container.remove(decorator.pos, decorator.end);

			// Make sure that it has a @prop decorator
			this.assertHasPropDecorator(emitProperty, context);

			// Return true
			return true;
		});

		// Set 'hasEventEmitters' to true if there were any results and any of them were 'true'
		this.stats.setHasEventEmitters(context.container.file, results.some(result => result));
	}

	/**
	 * Assert that a PropertyDeclaration annotated with "@setOnHost" also has a "@prop" decorator since we use the logic
	 * provided by that one to hook on to mutations of the value which ultimately leads to updating the attribute on the host
	 * @param {PropertyDeclaration} property
	 * @param {ICompilationContext} context
	 */
	private assertHasPropDecorator (property: PropertyDeclaration, context: ICompilationContext): void {

		// If it doesn't have a @prop decorator, add one to it
		if (!this.codeAnalyzer.propertyService.hasDecorator(this.configuration.preCompile.propDecoratorName, property)) {
			context.propertiesWithAddedPropDecorators.add(property);
		}
	}

}