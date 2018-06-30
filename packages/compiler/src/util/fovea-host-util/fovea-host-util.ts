import {IFoveaHostUtil} from "./i-fovea-host-util";
import {HTML_INTERFACE_NAMES, HtmlInterfaceName, SVG_INTERFACE_NAMES, SvgInterfaceName} from "@fovea/common";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {ClassDeclaration, ClassExpression} from "typescript";

/**
 * A utility class for working with Fovea hosts
 */
export class FoveaHostUtil implements IFoveaHostUtil {
	constructor (private readonly codeAnalyzer: ICodeAnalyzer) {
	}

	/**
	 * Returns true if the given class extends any HTMLElement or SVGElement
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public isBaseComponent (classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const extendedName = this.codeAnalyzer.classService.getNameOfExtendedClass(classDeclaration);
		if (extendedName == null) return false;

		return HTML_INTERFACE_NAMES.has(<HtmlInterfaceName> extendedName) || SVG_INTERFACE_NAMES.has(<SvgInterfaceName> extendedName);
	}

	/**
	 * Gets the name of the lowest inherited class
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {string | undefined}
	 */
	public resolveBaseClassName (classDeclaration: ClassDeclaration|ClassExpression): string|undefined {

		// If it doesn't extend anything, return its' own name
		if (this.codeAnalyzer.classService.isBaseClass(classDeclaration)) return this.codeAnalyzer.classService.getNameOfClass(classDeclaration);

		// If it is a BaseComponent, return the name of the class it extends
		if (this.isBaseComponent(classDeclaration)) {
			return this.codeAnalyzer.classService.getNameOfExtendedClass(classDeclaration);
		}

		// Otherwise, resolve the parent of the class
		const parent = this.codeAnalyzer.classService.resolveExtendedClass(classDeclaration);

		// If it somehow couldn't be resolved, return the name of that class
		if (parent == null) {
			return this.codeAnalyzer.classService.getNameOfExtendedClass(classDeclaration);
		}

		// Otherwise, return the name recursively
		return this.resolveBaseClassName(parent);
	}

	/**
	 * Returns true if the component requires the 'is=' attribute to properly extend an HTMLElement
	 * It will do so if it extends an HTMLElement that isn't "HTMLElement", for example "HTMLButtonElement"
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {string | false}
	 */
	public isCustomizedBuiltInElement (classDeclaration: ClassDeclaration|ClassExpression): string|false {
		// Resolve the base class name of the current class
		const baseClassName = this.resolveBaseClassName(classDeclaration);

		// If it doesn't have a name or if it is HTMLElement, return false
		if (baseClassName == null || baseClassName === "HTMLElement") return false;
		// If any of the HTML- or SVG interface names has the name of the base class, return the name of it
		if (HTML_INTERFACE_NAMES.has(<HtmlInterfaceName> baseClassName) || SVG_INTERFACE_NAMES.has(<SvgInterfaceName> baseClassName)) {
			return baseClassName;
		}

		// Otherwise, return false
		return false;
	}

}