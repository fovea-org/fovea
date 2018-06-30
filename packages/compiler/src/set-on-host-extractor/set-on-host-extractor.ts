import {ISetOnHostExtractor} from "./i-set-on-host-extractor";
import {ISetOnHostExtractorExtractOptions} from "./i-set-on-host-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {PropertyDeclaration} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

/**
 * A class that can extract properties annotated with a @setOnHost decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class SetOnHostExtractor implements ISetOnHostExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Extracts all properties decorated with a @setOnHost decorator and delegates it to the fovea-lib helper '__registerSetOnHost'.
	 * @param {ISetOnHostExtractorExtractOptions} options
	 */
	public extract (options: ISetOnHostExtractorExtractOptions): void {
		const {mark, insertPlacement, compilerOptions, context} = options;
		const {className, classDeclaration} = mark;

		// Take all props that has a "@setOnHost" decorator
		const setOnHostInstanceProperties = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.setOnHostDecoratorName, classDeclaration);
		const setOnHostStaticProperties = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.configuration.preCompile.setOnHostDecoratorName, classDeclaration);

		// Take all props
		const allProps = [...setOnHostInstanceProperties, ...setOnHostStaticProperties];

		// For each prop, generate a call to '__registerProp' and remove the '@prop' decorator
		allProps.forEach(setOnHostProperty => {

			// If we're on a dry run, return before mutating the SourceFile
			if (compilerOptions.dryRun) return;

			// Create the CallExpression
			context.container.appendAtPlacement(
				`\n${this.libUser.use("registerSetOnHost", compilerOptions, context)}("${this.codeAnalyzer.propertyNameService.getName(setOnHostProperty.name)}", ${this.codeAnalyzer.modifierService.isStatic(setOnHostProperty)}, <any>${className});`,
				insertPlacement
			);

			// Remove the @setOnHost decorator from it
			const decorator = this.codeAnalyzer.propertyService.getDecorator(this.configuration.preCompile.setOnHostDecoratorName, setOnHostProperty);
			if (decorator != null) {
				context.container.remove(decorator.pos, decorator.end);
			}

			// Make sure that it has a @prop decorator
			this.assertHasPropDecorator(setOnHostProperty, context);
		});
		// Set 'hasHostProps' on the stats to 'true' if there were at least 1 prop
		this.stats.setHasHostProps(context.container.file, allProps.length > 0);
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