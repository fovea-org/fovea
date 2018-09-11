import {IPropertiesToAttributesMapper} from "./i-properties-to-attributes-mapper";
import {IPropertiesToAttributesMapOptions} from "./i-properties-to-attributes-map-options";
import {IConfiguration} from "../configuration/i-configuration";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ILibUser} from "../lib-user/i-lib-user";
import {kebabCase} from "@wessberg/stringutil";

/**
 * A class that can extract the corresponding attribute names for properties that should be observed or set on the host as props.
 */
export class PropertiesToAttributesMapper implements IPropertiesToAttributesMapper {
	constructor (private readonly configuration: IConfiguration,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly libUser: ILibUser) {
	}

	/**
	 * Extracts all properties that should be observed or set on the host and delegates them to the fovea-lib helper '___mapPropertiesToAttributes'
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {IPlacement} insertPlacement
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 */
	public map ({mark, insertPlacement, compilerOptions, context}: IPropertiesToAttributesMapOptions): void {

		// Take all props that has a "@prop" decorator
		const observedProps = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.propDecoratorName, mark.classDeclaration);
		// Take all props that has a "@setOnHost" decorator
		const setOnHostProperties = this.codeAnalyzer.classService.getPropertiesWithDecorator(this.configuration.preCompile.setOnHostDecoratorName, mark.classDeclaration);

		// Take the names of the properties and deduplicate them
		const observedPropNames = [...new Set([...observedProps, ...setOnHostProperties].map(property => this.codeAnalyzer.propertyNameService.getName(property.name)))];

		// Map all observed property names to tuples between the property names and their dash-/kebab-cased counterparts (which will be attribute names)
		const tuples = observedPropNames.map(property => {
			// kebab-case it
			const kebabCased = kebabCase(property);

			// If the property has an identical name, just add the pure property name
			if (property === kebabCased) {
				return `"${property}"`;
			}

			// Otherwise, add the tuple pair between the property and the property kebab-cased
			else {
				return `["${property}", "${kebabCased}"]`;
			}
		});

		// Only generate the CallExpression if there is at least one property to map and we're not on a dry run
		if (tuples.length > 0 && !compilerOptions.dryRun) {
			context.container.appendAtPlacement(
				`\n${this.libUser.use("mapPropertiesToAttributes", compilerOptions, context)}(${tuples.join(", ")})`,
				insertPlacement
			);
		}
	}

}