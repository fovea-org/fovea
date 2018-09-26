import {IFoveaHostMarker} from "./i-fovea-host-marker";
import {IFoveaHostMarkerMarkOptions} from "./i-fovea-host-marker-mark-options";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ClassDeclaration, ClassExpression} from "typescript";
import {IFoveaHostUtil} from "../util/fovea-host-util/i-fovea-host-util";
import {FoveaHostMarkerMarkResult} from "./fovea-host-marker-mark-result";
import {IConfiguration} from "../configuration/i-configuration";
import {FoveaHostKind} from "@fovea/common";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";

/**
 * A class that determines whether or not a class is valid for compilation with Fovea.
 * It will be if it is either an Custom Element or a Custom Attribute
 */
export class FoveaHostMarker implements IFoveaHostMarker {
	constructor (private readonly configuration: IConfiguration,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly foveaHostUtil: IFoveaHostUtil) {
	}

	/**
	 * Checks if the provided class is a Custom Element or a Custom Attribute and thus is qualified for compilation.
	 * @param {ClassDeclaration} classDeclaration
	 * @param {string} file
	 * @returns {FoveaHostMarkerMarkResult}
	 */
	public mark ({classDeclaration, file}: IFoveaHostMarkerMarkOptions): FoveaHostMarkerMarkResult {
		return this.shouldIncludeClass(classDeclaration, file);
	}

	/**
	 * Returns true if the class is qualified for compilation. It will be if it extends
	 * any HTML- or SVGElement.
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @param {string} file
	 * @param {ClassDeclaration|ClassExpression} [originalClassDeclaration]
	 * @returns {FoveaHostMarkerMarkResult}
	 */
	private shouldIncludeClass (classDeclaration: ClassDeclaration|ClassExpression, file: string, originalClassDeclaration: ClassDeclaration|ClassExpression = classDeclaration): FoveaHostMarkerMarkResult {
		const sourceFile = originalClassDeclaration.getSourceFile();

		// Check if a 'customElements.define' call exists within the SourceFile
		const isManuallyRegistered = this.codeAnalyzer.callExpressionService.getCallExpressionsMatching(/customElements\.define/, originalClassDeclaration.getSourceFile(), true).length > 0;

		// Check if it is a Custom Attribute (it will be if it is annotated with the decorator '@customAttribute')
		const isCustomAttribute = this.codeAnalyzer.classService.hasDecorator(this.configuration.preCompile.customAttributeDecoratorName, classDeclaration);

		// Take the class name
		const className = this.codeAnalyzer.classService.getNameOfClass(originalClassDeclaration);

		// Check if the component has previously been compiled
		const isPrecompiled = (
			this.codeAnalyzer.classService.hasStaticPropertyWithName(this.configuration.postCompile.compilerFlagsPropName, originalClassDeclaration) ||
			sourceFile.text.includes(`${className}.${this.configuration.postCompile.compilerFlagsPropName}`)
		);

		// Check if the component is a standard Custom Element already (we use heuristics here - if the file doesn't import anything from @fovea/core, and if a 'customElements.define' statement is located within the SourceFile, we treat it as such)
		const isStandardCustomElement = !isPrecompiled && this.codeAnalyzer.importService.getImportsForPath(this.configuration.foveaModuleName, sourceFile).length < 1 && isManuallyRegistered;

		// If the class has no name, or if it has been compiled previously, or if it is a standard Custom Element, don't include it
		if (className == null || isPrecompiled || isStandardCustomElement) return {include: false, isPrecompiled, classDeclaration: originalClassDeclaration, className, sourceFile};

		// If it doesn't extend anything, only include it if it is decorated with @customAttribute (in which case it is a Custom Attribute
		if (this.codeAnalyzer.classService.isBaseClass(classDeclaration)) {

			// If it is a custom attribute, include it and add to the stats that a custom attribute has been found
			if (isCustomAttribute && className != null) {
				return {
					include: true,
					kind: FoveaHostKind.CUSTOM_ATTRIBUTE,
					classDeclaration: originalClassDeclaration,
					className,
					sourceFile: originalClassDeclaration.getSourceFile(),
					isManuallyRegistered,
					file
				};
			}

			// Otherwise, don't include it
			return {include: false, isPrecompiled, classDeclaration: originalClassDeclaration, className, sourceFile};
		}

		// If the class extends any HTML- or SVG-element, it is a base component and should be included
		// unless it also has the @customAttribute decorator in which case an error should be thrown
		if (this.foveaHostUtil.isBaseComponent(classDeclaration)) {

			// If it is not a Custom Attribute, include it!
			if (!isCustomAttribute) {
				if (className != null) {
					return {include: true, isManuallyRegistered, kind: FoveaHostKind.CUSTOM_ELEMENT, classDeclaration: originalClassDeclaration, className, sourceFile: originalClassDeclaration.getSourceFile(), file};
				}

				else {
					// Otherwise, don't include it
					return {include: false, isPrecompiled, classDeclaration: originalClassDeclaration, className, sourceFile};
				}
			}

			// Otherwise, it is both a Base Component AND a Custom Attribute.
			// We don't know what the user wants here, so add a diagnostic
			else {
				this.diagnostics.addDiagnostic(file, {kind: FoveaDiagnosticKind.AMBIGUOUS_HOST, hostName: this.codeAnalyzer.classService.getNameOfClass(originalClassDeclaration)!, extendsName: this.codeAnalyzer.classService.getNameOfExtendedClass(classDeclaration)!});
				return {include: false, isPrecompiled, classDeclaration: originalClassDeclaration, className, sourceFile};
			}
		}

		// Otherwise, resolve the parent class
		const parentDeclaration = this.codeAnalyzer.classService.resolveExtendedClass(classDeclaration);

		// If the parent expression is not a class, don't include it
		if (parentDeclaration == null) {
			return {include: false, isPrecompiled, classDeclaration: originalClassDeclaration, className, sourceFile};
		}

		// Check recursively
		return this.shouldIncludeClass(parentDeclaration, file, originalClassDeclaration);
	}

}