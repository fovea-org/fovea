import {ISetOnHostExtractor} from "./i-set-on-host-extractor";
import {ISetOnHostExtractorExtractOptions} from "./i-set-on-host-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {PropertyDeclaration} from "typescript";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract properties annotated with a @setOnHost decorator from a Component prototype and invoke the helpers in fovea-lib
 */
export class SetOnHostExtractor implements ISetOnHostExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @setOnHost decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.setOnHostDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @setOnHost decorator and delegates it to the fovea-lib helper '___registerSetOnHost'.
	 * @param {ISetOnHostExtractorExtractOptions} options
	 */
	public extract (options: ISetOnHostExtractorExtractOptions): void {
		const {mark, compilerOptions, context} = options;
		const {classDeclaration} = mark;

		// Take all props that has a "@setOnHost" decorator
		const setOnHostInstanceProperties = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.setOnHostDecoratorName, classDeclaration);
		const setOnHostStaticProperties = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.configuration.preCompile.setOnHostDecoratorName, classDeclaration);

		// Take all props
		const allProps = [...setOnHostInstanceProperties, ...setOnHostStaticProperties];

		// Store all calls to 'registerSetOnHost' here
		const registerSetOnHostCalls: string[] = [];

		// For each prop, generate a call to '___registerProp' and remove the '@prop' decorator
		allProps.forEach(setOnHostProperty => {

			// Take all decorators for the method
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, setOnHostProperty);
			decorators.forEach(decorator => {
				// If we're on a dry run, return before mutating the SourceFile
				if (compilerOptions.dryRun) return;

				registerSetOnHostCalls.push(`${this.libUser.use("registerSetOnHost", compilerOptions, context)}("${this.codeAnalyzer.propertyNameService.getName(setOnHostProperty.name)}", ${this.codeAnalyzer.modifierService.isStatic(setOnHostProperty)}, this);`);

				// Remove the @setOnHost decorator from it
				context.container.remove(decorator.pos, decorator.end);

				// Make sure that it has a @prop decorator
				this.assertHasPropDecorator(setOnHostProperty, context);
			});
		});

		// If there is at least 1 host prop, add the prototype method
		if (registerSetOnHostCalls.length > 0) {

			const body = (
				this.foveaHostUtil.isBaseClass(classDeclaration) || this.foveaHostUtil.isBaseComponent(classDeclaration)
					? `\n		${registerSetOnHostCalls.join("\n		")}`
					: `\n		// ts-ignore` +
					`\n		if (super.${this.configuration.postCompile.registerSetOnHostPropsMethodName} != null) super.${this.configuration.postCompile.registerSetOnHostPropsMethodName}();` +
					`\n		${registerSetOnHostCalls.join("\n		")}`
			);

			if (!compilerOptions.dryRun) {

				// Create the static method
				context.container.appendLeft(
					classDeclaration.members.end,
					`\n	public static ${this.configuration.postCompile.registerSetOnHostPropsMethodName} (): void {` +
					`${body}` +
					`\n	}`
				);
			}
		}

		// Set 'hasHostProps' to true if there were any 'registerSetOnHost' instructions, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasHostProps(context.container.file, statsForFile.hasHostProps || registerSetOnHostCalls.length > 0);
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