import {IFoveaHostDefiner} from "./i-fovea-host-definer";
import {IFoveaHostDefinerDefineOptions} from "./i-fovea-host-definer-define-options";
import {IFoveaHostDefinerDefineResult} from "./i-fovea-host-definer-define-result";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IConfiguration} from "../configuration/i-configuration";
import {ILibUser} from "../lib-user/i-lib-user";
import {ClassDeclaration, ClassExpression, Decorator, ExportSpecifier, isCallExpression, SourceFile} from "typescript";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {FoveaHostKind} from "../fovea-marker/fovea-host-kind";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {FoveaHostDefinerExportStatus, IFoveaHostDefinerNoExportStatus} from "./i-fovea-host-definer-export-status";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {IInvalidSelectorDecoratorUsageFoveaDiagnosticCtor} from "../diagnostics/fovea-diagnostic-ctor";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {containsWhitespace, isLowerCase, kebabCase, removeWhitespace, unquote} from "@wessberg/stringutil";

/**
 * A class that can define a Custom Element or a Custom Attribute
 */
export class FoveaHostDefiner implements IFoveaHostDefiner {
	constructor (private readonly stats: IFoveaStats,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly configuration: IConfiguration,
							 private readonly libUser: ILibUser,
							 private readonly codeAnalyzer: ICodeAnalyzer) {
	}

	/**
	 * Defines a Custom Element or a Custom Attribute by extracting a name for it and delegating it to a fovea-lib helper
	 * @param {IFoveaHostMarkerMarkIncludeResult} mark
	 * @param {IPlacement} insertPlacement
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @returns {IFoveaHostDefinerDefineResult}
	 */
	public define ({mark, insertPlacement, compilerOptions, context}: IFoveaHostDefinerDefineOptions): IFoveaHostDefinerDefineResult|undefined {
		// Take the name of the class
		const {className, sourceFile} = mark;

		// Generate the selector for the element
		const selector = this.generateSelectorName(mark, compilerOptions, context);

		// Add it to the declarations for the file (unless it has already been registered)
		const {declaredCustomSelectors} = this.stats.getStatsForFile(context.container.file);
		const hasDeclarationAlready = declaredCustomSelectors.some(existing => existing.hostName === className && existing.kind === mark.kind && existing.selector === selector);

		if (!hasDeclarationAlready) {
			const exportStatus = this.checkHostExportStatus(mark.classDeclaration, className, sourceFile);

			// Remove any UNKNOWN_SELECTOR diagnostics that may exist and that points to this selector now that it has been defined
			this.diagnostics.filterAndUpdate(diagnostic => !(diagnostic.kind === FoveaDiagnosticKind.UNKNOWN_SELECTOR && diagnostic.selector === selector));
			this.stats.setDeclaredCustomSelectors(context.container.file, [...declaredCustomSelectors, {
				// If the host is being exported, it may be exported with an aliased name
				hostName: exportStatus.isDefaultExport || exportStatus.isNamedExport ? exportStatus.exportName : className,
				kind: mark.kind,
				selector,
				file: context.container.file,
				isDefaultExport: exportStatus.isDefaultExport,
				isNamedExport: exportStatus.isNamedExport
			}]);
		}

		// Don't perform the SourceFile mutation if we're on a dryRun, or if the file has already been registered
		if (!compilerOptions.dryRun && !mark.isManuallyRegistered) {

			// Add a instruction to define the element or Custom Attribute immediately after the ClassDeclaration
			context.container.appendAtPlacement(
				`\n${this.libUser.use(mark.kind === FoveaHostKind.HOST ? "registerElement" : "registerCustomAttribute", compilerOptions, context)}("${selector}", ${className});`,
				insertPlacement
			);
		}

		return {
			selector
		};
	}

	/**
	 * Checks if the host is exported and how
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @param {string} className
	 * @param {SourceFile} sourceFile
	 * @returns {FoveaHostDefinerExportStatus}
	 */
	public checkHostExportStatus (classDeclaration: ClassDeclaration|ClassExpression, className: string, sourceFile: SourceFile): FoveaHostDefinerExportStatus {

		// Check if the class has an 'export' keyword in front of it
		const hasExportModifier = this.codeAnalyzer.modifierService.hasModifierWithName("export", classDeclaration);

		// Check if the class has the keywords 'export default' keywords in front of it
		const hasDefaultExportModifier = hasExportModifier && this.codeAnalyzer.modifierService.hasModifierWithName("default", classDeclaration);

		// If it has any of those, we're done here
		if (hasDefaultExportModifier) return {isDefaultExport: true, isNamedExport: false, exportName: className};
		if (hasExportModifier) return {isDefaultExport: false, isNamedExport: true, exportName: className};

		// Otherwise, look for an export declaration in the SourceFile that refers to any of these
		const allExports = this.codeAnalyzer.exportService.getAll(sourceFile);
		let namedExportMatch: ExportSpecifier|null|undefined = null;
		allExports.forEach(exportDeclaration => {
			if (exportDeclaration.exportClause == null) return;
			namedExportMatch = exportDeclaration.exportClause.elements.find(element => this.codeAnalyzer.identifierService.getText(element.name) === className || element.propertyName != null && this.codeAnalyzer.identifierService.getText(element.propertyName) === className);
		});

		// If there is a named export, check it out
		if (namedExportMatch != null) {

			// The exported name will be the name of the exported binding. It may be aliased with an 'AS'.
			return {
				isDefaultExport: false,
				isNamedExport: true,
				exportName: this.codeAnalyzer.identifierService.getText((<ExportSpecifier> namedExportMatch).name)
			};
		}

		// Otherwise, look for a default export assignment that refers to the host
		else {
			const defaultExportAssignmentMatch = this.codeAnalyzer.exportService.getDefaultExportAssignment(sourceFile);

			// If there is an export assignment, make sure that it actually refers to the component
			if (defaultExportAssignmentMatch != null) {
				// Print the expression on the right-hand side (it may be an expression such as 'export = Foo' or 'export default Foo')
				const expression = this.codeAnalyzer.printer.print(defaultExportAssignmentMatch.expression);

				// If it matches the class name, it is default exported!
				if (expression === className) {
					return {isDefaultExport: true, isNamedExport: false, exportName: className};
				}
			}

			// Otherwise, there was no export for the component
			return <IFoveaHostDefinerNoExportStatus> {isDefaultExport: false, isNamedExport: false};
		}
	}

	/**
	 * Generates a selector name for the class.
	 * If one is provided from a decorator, use that one
	 * @param {ClassDeclaration|IFoveaHostMarkerMarkIncludeResult} mark
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @returns {string}
	 */
	private generateSelectorName (mark: IFoveaHostMarkerMarkIncludeResult, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): string {

		// First, check if the class is annotated with a 'selector' decorator
		const selectorDecorator = this.codeAnalyzer.classService.getDecorator(new RegExp(`${this.configuration.preCompile.selectorDecoratorName}`), mark.classDeclaration);
		if (selectorDecorator != null) {

			// Return the name given in the decorator
			return this.generateSelectorFromDecorator(mark, selectorDecorator, compilerOptions, context);
		}

		// Otherwise, generate a selector from the name of the class
		return this.normalizeSelectorName(mark.className, mark.kind);
	}

	/**
	 * Normalizes the provided selector name
	 * @param {string} selectorName
	 * @param {FoveaHostKind} kind
	 * @returns {string}
	 */
	private normalizeSelectorName (selectorName: string, kind: FoveaHostKind): string {
		return kind === FoveaHostKind.CUSTOM_ATTRIBUTE
			? this.normalizeCustomAttributeSelectorName(selectorName)
			: this.normalizeCustomElementSelectorName(selectorName);
	}

	/**
	 * Normalizes the provided selector name so it follows the semantic rules of Custom Elements
	 * @param {string} selectorName
	 * @returns {string}
	 */
	private normalizeCustomElementSelectorName (selectorName: string): string {
		// Generate a dash-/kebab-cased name and use it as the selector
		let selector = kebabCase(selectorName);
		// If the name does not include a "-" which is required for Custom Elements, add the fallback suffix to it
		if (!selector.includes("-")) {
			selector = `${selector}-${this.configuration.componentFallbackSuffix}`;
		}

		// Remove all whitespace from the selector and make sure that it is in lowerCase
		return removeWhitespace(selector).toLowerCase();
	}

	/**
	 * Normalizes the provided Custom Attribute selector name. There are no particular rules, so the provided selector name will
	 * be used as-is, except it will be dash-cased
	 * @param {string} selectorName
	 * @returns {string}
	 */
	private normalizeCustomAttributeSelectorName (selectorName: string): string {
		// Generate a dash-/kebab-cased name and use it as the selector
		return kebabCase(selectorName);
	}

	/**
	 * Validates the selector name provided from within a Decorator
	 * @param {string} file
	 * @param {string} selector
	 * @param {string} className
	 * @param {string} decoratorExpression
	 * @param {FoveaHostKind} kind
	 */
	private validateDecoratorSelectorName (file: string, selector: string, className: string, decoratorExpression: string, kind: FoveaHostKind): void {
		// If the selector is a FoveaHostKind, everything is possible!
		if (kind === FoveaHostKind.CUSTOM_ATTRIBUTE) return;

		// Otherwise, make sure that the selector respects the Custom Elements semantics
		if (!selector.includes("-")) {
			this.diagnostics.addDiagnostic(file, {kind: FoveaDiagnosticKind.INVALID_SELECTOR_NEEDS_HYPHEN, selector, hostName: className, hostKind: kind, decoratorContent: decoratorExpression});
		}

		// Make sure that the selector doesn't include whitespace
		if (containsWhitespace(selector)) {
			this.diagnostics.addDiagnostic(file, {kind: FoveaDiagnosticKind.INVALID_SELECTOR_HAS_WHITESPACE, selector, hostName: className, hostKind: kind, decoratorContent: decoratorExpression});
		}

		// Make sure that the selector is in lowerCase
		if (!isLowerCase(selector)) {
			this.diagnostics.addDiagnostic(file, {kind: FoveaDiagnosticKind.INVALID_SELECTOR_IS_NOT_ALL_LOWER_CASE, selector, hostName: className, hostKind: kind, decoratorContent: decoratorExpression});
		}
	}

	/**
	 * Generates a selector from the user-provided decorator
	 * @param {FoveaHostKind} kind
	 * @param {string} file
	 * @param {string} className
	 * @param {Decorator} decorator
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @returns {string}
	 */
	private generateSelectorFromDecorator ({kind, className}: IFoveaHostMarkerMarkIncludeResult, decorator: Decorator, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): string {

		// If the expression of the decorator is not a CallExpression, there will be no selector.
		const decoratorExpression = this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator);
		const diagnostic: IInvalidSelectorDecoratorUsageFoveaDiagnosticCtor = {kind: FoveaDiagnosticKind.INVALID_SELECTOR_DECORATOR_USAGE, hostName: className, hostKind: kind, decoratorContent: decoratorExpression};
		if (!isCallExpression(decorator.expression)) {
			this.diagnostics.addDiagnostic(context.container.file, diagnostic);
			return "";
		}

		// Take the first argument from the CallExpression
		const [firstArgument] = this.codeAnalyzer.callExpressionService.getArguments(decorator.expression);
		// If it has none, there will be no selector
		if (firstArgument == null) {
			this.diagnostics.addDiagnostic(context.container.file, diagnostic);
			return "";
		}

		// Otherwise, validate the given selector
		const selector = unquote(firstArgument);

		// Validate the selector name provided from the decorator
		this.validateDecoratorSelectorName(context.container.file, selector, className, decoratorExpression, kind);

		if (!compilerOptions.dryRun) {
			// Remove the decorator. We are done with it
			context.container.remove(decorator.pos, decorator.end);
		}

		return selector;
	}

}