import {IPropExtractor} from "./i-prop-extractor";
import {IPropExtractorExtractOptions} from "./i-prop-extractor-extract-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ITypeExtractorService} from "../type-extractor/i-type-extractor-service";

/**
 * A class that can extract props from a Component prototype and invoke the helpers in fovea-lib
 */
export class PropExtractor implements IPropExtractor {
	constructor (private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly typeExtractor: ITypeExtractorService,
							 private readonly libUser: ILibUser,
							 private readonly astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Extracts all properties decorated with a @prop decorator and delegates it to the fovea-lib helper '__registerProp'.
	 * @param {IPropExtractorExtractOptions} options
	 */
	public extract (options: IPropExtractorExtractOptions): void {
		const {mark, insertPlacement, context, compilerOptions} = options;
		const {className, classDeclaration} = mark;

		// Take all props that has a "@prop" decorator (which will be those that should be extracted)
		const observedInstanceProps = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, classDeclaration);
		const observedStaticProps = this.codeAnalyzer.classService.getStaticPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, classDeclaration);
		const observedExtraProps = Array.from(context.propertiesWithAddedPropDecorators);

		// Take all props
		const allProps = [...observedInstanceProps, ...observedStaticProps, ...observedExtraProps];

		// For each prop, generate a call to '__registerProp' and remove the '@prop' decorator
		allProps.map(observedProp => {

			// If we're on a dry run, return before mutating the SourceFile
			if (compilerOptions.dryRun) return;

			// Create the CallExpression
			context.container.appendAtPlacement(
				`\n${this.libUser.use("registerProp", compilerOptions, context)}("${this.codeAnalyzer.propertyNameService.getName(observedProp.name)}", ${JSON.stringify(this.typeExtractor.getType(observedProp.type == null ? observedProp.initializer == null ? "any" : this.astUtil.getTypeNameOfExpression(observedProp.initializer) : this.codeAnalyzer.typeNodeService.getNameOfType(observedProp.type)))}, ${this.codeAnalyzer.modifierService.isStatic(observedProp)}, <any>${className});`,
				insertPlacement
			);

			// Remove the @prop decorator from it, if it has any
			const decorator = this.codeAnalyzer.propertyService.getDecorator(this.configuration.preCompile.propDecoratorName, observedProp);
			if (decorator != null) {
				context.container.remove(decorator.pos, decorator.end);
			}

			// Add a '@ts-ignore' comment since Typescript may throw if it decides that the prop is unused because it is being used from outside the class
			context.container.prependLeft(observedProp.pos, "\n// @ts-ignore\n");
		});

		// Set 'hasProps' on the stats to 'true' if there were at least 1 prop
		this.stats.setHasProps(context.container.file, allProps.length > 0);
	}

}