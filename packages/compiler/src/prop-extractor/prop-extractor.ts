import {IPropExtractor} from "./i-prop-extractor";
import {IPropExtractorExtractOptions} from "./i-prop-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ITypeExtractorService} from "../type-extractor/i-type-extractor-service";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";

/**
 * A class that can extract props from a Component prototype and invoke the helpers in fovea-lib
 */
export class PropExtractor implements IPropExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly typeExtractor: ITypeExtractorService,
							 private readonly libUser: ILibUser,
							 private readonly astUtil: ITypescriptASTUtil,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @prop decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.propDecoratorName}`);
	}

	/**
	 * Extracts all properties decorated with a @prop decorator and delegates it to the fovea-lib helper '___registerProp'.
	 * @param {IPropExtractorExtractOptions} options
	 */
	public extract (options: IPropExtractorExtractOptions): void {
		const {mark, context, compilerOptions} = options;
		const {classDeclaration} = mark;

		// Take all props that has a "@prop" decorator (which will be those that should be extracted)
		const observedInstanceProps = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, classDeclaration);
		const observedStaticProps = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, classDeclaration);
		const observedExtraProps = Array.from(context.propertiesWithAddedPropDecorators);

		// Take all props
		const allProps = [...observedInstanceProps, ...observedStaticProps, ...observedExtraProps];

		// Store all calls to 'registerProp' here
		const registerPropCalls: string[] = [];

		// For each prop, generate a call to '___registerProp' and remove the '@prop' decorator
		allProps.forEach(observedProp => {

			// If we're on a dry run, return before doing anything
			if (compilerOptions.dryRun) return;

			// Take all decorators for the property.
			// There may be no decorators at all! That will be the case for all of the observed extra props (e.g. those that has no prop decorator but should be treated as though they had, for example for '@setOnHost' decorators without a matching '@prop' decorator)
			const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, observedProp);

			// Prepare a call to 'registerProp'
			registerPropCalls.push(`${this.libUser.use("registerProp", compilerOptions, context)}("${this.codeAnalyzer.propertyNameService.getName(observedProp.name)}", ${JSON.stringify(this.typeExtractor.getType(observedProp.type == null ? observedProp.initializer == null ? "any" : this.astUtil.getTypeNameOfExpression(observedProp.initializer) : this.codeAnalyzer.typeNodeService.getNameOfType(observedProp.type)))}, ${this.codeAnalyzer.modifierService.isStatic(observedProp)}, this);`);

			// Add a '@ts-ignore' comment since Typescript may throw if it decides that the prop is unused because it is being used from outside the class
			context.container.prependLeft(observedProp.pos, "\n// @ts-ignore\n");

			// Loop through all of the decorators (if there are any) and remove them for the compiled output
			decorators.forEach(decorator => {
				// Remove the @prop decorator
				context.container.remove(decorator.pos, decorator.end);
			});
		});

		// If there is at least 1 prop, add the prototype method
		if (registerPropCalls.length > 0 && !compilerOptions.dryRun) {

			const registerBody = (
				this.foveaHostUtil.isBaseComponent(classDeclaration)
					? `\n		${registerPropCalls.join("\n		")}`
					: `\n		// ts-ignore` +
					`\n		if (super.${this.configuration.postCompile.registerPropsMethodName} != null) super.${this.configuration.postCompile.registerPropsMethodName}();` +
					`\n		${registerPropCalls.join("\n		")}`
			);

			const connectBody = (
				`\n		${this.libUser.use("connectProps", compilerOptions, context)}(this);`
			);

			const disposeBody = (
				`\n		${this.libUser.use("disposeProps", compilerOptions, context)}(this);`
			);

			// Create the 'register' method
			context.container.appendLeft(
				classDeclaration.members.end,
				`\n	protected static ${this.configuration.postCompile.registerPropsMethodName} (): void {` +
				`${registerBody}` +
				`\n	}`
			);

			// Create the 'connect' method
			context.container.appendLeft(
				classDeclaration.members.end,
				`\n	protected ${this.configuration.postCompile.connectPropsMethodName} (): void {` +
				`${connectBody}` +
				`\n	}`
			);

			// Create the 'dispose' method
			context.container.appendLeft(
				classDeclaration.members.end,
				`\n	protected ${this.configuration.postCompile.disposePropsMethodName} (): void {` +
				`${disposeBody}` +
				`\n	}`
			);
		}

		// Set 'hasProps' if there were at least 1 prop, or if another host within the file already has a truthy value for it
		const statsForFile = this.stats.getStatsForFile(context.container.file);
		this.stats.setHasProps(context.container.file, statsForFile.hasProps || registerPropCalls.length > 0);
	}

}