import {IDependencyImporter} from "./i-dependency-importer";
import {IDependencyImporterImportOptions} from "./i-dependency-importer-import-options";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IFoveaStats} from "../stats/i-fovea-stats";
import {ILibUser} from "../lib-user/i-lib-user";
import {IReferencedCustomSelector} from "@fovea/dom";
import {ImportDeclaration, isCallExpression} from "typescript";
import {IDeclaredCustomSelector} from "../stats/i-declared-custom-selector";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {FoveaDiagnosticKind} from "../diagnostics/fovea-diagnostic-kind";
import {IPathUtil} from "@wessberg/pathutil";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IConfiguration} from "../configuration/i-configuration";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";

/**
 * A class that will make sure that all components that another component uses as part of its
 * template is actually imported by it
 */
export class DependencyImporter implements IDependencyImporter {
	constructor (private readonly stats: IFoveaStats,
							 private readonly configuration: IConfiguration,
							 private readonly diagnostics: IFoveaDiagnostics,
							 private readonly libUser: ILibUser,
							 private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly pathUtil: IPathUtil) {
	}

	/**
	 * Gets a Regular Expression that matches the name of @dependsOn decorators
	 * @returns {RegExp}
	 */
	private get decoratorNameRegex (): RegExp {
		return new RegExp(`^${this.configuration.preCompile.dependsOnDecoratorName}`);
	}

	/**
	 * Adds import statements and calls the lib helper '___dependsOn' for each
	 * component or custom attribute that the component depends on
	 * @param {IDependencyImporterImportOptions} options
	 */
	public importDependencies (options: IDependencyImporterImportOptions): void {
		const {mark, context, compilerOptions, insertPlacement} = options;

		// Take all custom selectors that are referenced as part of the component template
		const dependencies = this.stats.getStatsForFile(context.container.file).referencedCustomSelectors;

		// Take all declarations
		const declarations = this.stats.declaredCustomSelectors;

		// All of the identifiers that this component depends on
		const dependsOnIdentifiers: Set<string> = new Set();

		// Take the '@dependsOn' decorator that the class may be annotated with
		const decorators = this.codeAnalyzer.decoratorService.getDecoratorsWithExpression(this.decoratorNameRegex, mark.classDeclaration);
		decorators.forEach(decorator => {
			// Assert that it is in fact invoked
			if (!isCallExpression(decorator.expression)) {
				this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.INVALID_DEPENDS_ON_DECORATOR_USAGE, hostName: mark.className, hostKind: mark.kind, decoratorContent: this.codeAnalyzer.decoratorService.takeDecoratorExpression(decorator)});
				return;
			}

			// Take all the arguments provided to the '@dependsOn' decorator. These will be the components that the component explicitly depends on.
			for (const identifier of decorator.expression.arguments.map(argument => this.codeAnalyzer.printer.print(argument))) {
				dependsOnIdentifiers.add(identifier);
			}

			if (!compilerOptions.dryRun) {
				// Remove the @dependsOn decorator from it
				context.container.remove(decorator.pos, decorator.end);
			}
		});

		// Take all of the dependencies and add them to the Set of identifiers that the component depends on
		dependencies
			.map(dependency => this.handleDependency(declarations, dependency, mark, compilerOptions, context))
			.filter(name => name != null)
			.forEach((name: string) => dependsOnIdentifiers.add(name));

		if (!compilerOptions.dryRun && dependsOnIdentifiers.size > 0) {
			// Invoke '___dependsOn' with each imported name
			context.container.appendAtPlacement(
				`\n${this.libUser.use("dependsOn", compilerOptions, context)}(${[...dependsOnIdentifiers].map(name => `${name}`).join(", ")});`,
				insertPlacement
			);
		}
	}

	/**
	 * Asserts that the host file imports the component it depends on and returns the name of the imported identifier within the scope of the file
	 * @param {IDeclaredCustomSelector[]} declarations
	 * @param {IReferencedCustomSelector} dependency
	 * @param {IFoveaHostMarkerMarkIncludeResult} mark
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @returns {string | null}
	 */
	private handleDependency (declarations: IDeclaredCustomSelector[], dependency: IReferencedCustomSelector, {className, sourceFile}: IFoveaHostMarkerMarkIncludeResult, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext): string|null {
		const match = declarations.find(({kind, selector}) => dependency.kind === kind && dependency.selector === selector);

		if (match == null) {
			if (compilerOptions.dryRun) return null;
			this.diagnostics.addDiagnostic(context.container.file, {kind: FoveaDiagnosticKind.UNKNOWN_SELECTOR, hostKind: dependency.kind, hostName: className, selector: dependency.selector});
			return null;
		}

		// Make sure that the component or custom attribute is actually imported by the file using it
		const existingImports = this.codeAnalyzer.importService.getImportsForPath(match.file, sourceFile);

		// Hold the name of the imported component. It may be aliased within the file scope. Make sure to look through all imports from that path before adding the import
		let importName = this.getImportedNameForDependency(existingImports, context.container.file, match, compilerOptions, context, false);
		if (importName == null) {
			// Now, if the path isn't imported, make sure to do so
			importName = this.getImportedNameForDependency(existingImports, context.container.file, match, compilerOptions, context, true);
		}

		// Return the import name
		return importName;
	}

	/**
	 * Checks all the given import declarations for the one that matches the component that declares a used selector
	 * If 'importIfNeeded' is true, it will add it if missing. It returns the name of the binding in the local scope
	 * of the file
	 * @param {ImportDeclaration[]} existingImports
	 * @param {string} file
	 * @param {IDeclaredCustomSelector} match
	 * @param {IFoveaCompilerOptions} compilerOptions
	 * @param {ICompilationContext} context
	 * @param {boolean} importIfNeeded
	 * @returns {string | null}
	 */
	private getImportedNameForDependency (existingImports: ImportDeclaration[], file: string, match: IDeclaredCustomSelector, compilerOptions: IFoveaCompilerOptions, context: ICompilationContext, importIfNeeded: boolean = true): string|null {

		// if the dependency is declared within the file itself, simply use the name of that host (and don't add any imports)
		if (match.file === file) {
			return match.hostName;
		}

		// Otherwise, if the file is not imported at all, add a new import declaration
		else if (existingImports.length === 0) {
			if (importIfNeeded) {
				// Import only the path if the component isn't exported at all
				if (!compilerOptions.dryRun) {
					const beginning = `import `;
					const ending = `"${this.pathUtil.clearExtension(match.file)}";`;
					context.container.prepend(
						`${beginning}${
							match.isDefaultExport
								? `${match.hostName} from `
								: match.isNamedExport
								? `{${match.hostName}} from `
								: ""
							}${ending}\n`
					);
				}
				return match.hostName;
			}
		}

		for (const existingImport of existingImports) {
			// Don't proceed if we already successfully imported the component

			// If it is exported as a default export, no matter what, if the default export is imported by the component, so is the component
			if (match.isDefaultExport) {
				// Check if the import declaration has a default import
				const defaultImport = this.codeAnalyzer.importService.getNameForImportDeclaration(existingImport);

				// If it has, take that name.
				if (defaultImport != null) {
					return this.codeAnalyzer.identifierService.getText(defaultImport);
				}

				// Otherwise, add a default import to the declaration!
				else {
					if (importIfNeeded) {
						const importName = match.hostName;
						if (!compilerOptions.dryRun) {
							const existingName = existingImport.importClause == null ? null : existingImport.importClause.name;

							// Overwrite the existing name if it has one
							if (existingName != null) {
								context.container.overwrite(existingName.pos, existingName.end, importName);
							}

							// Otherwise, the path is imported without any bindings
							else if (existingImport.importClause == null) {
								context.container.overwrite(
									existingImport.pos, existingImport.end,
									`import ${importName} from "${this.codeAnalyzer.importService.getPathForImportDeclaration(existingImport)}";\n`
								);
							}

							// Otherwise, overwrite the import but be mindful of reusing whatever content it already has
							else {
								// Take the namespace for the import - if it has one
								const namespace = this.codeAnalyzer.importService.getNamespaceImportForImportDeclaration(existingImport);

								// If it has a namespace, simply add the default import immediately before it
								if (namespace != null) {
									context.container.prependLeft(namespace.pos, ` ${importName},`);
								}

								// Otherwise, check if the import has any named bindings
								else {
									const namedBindings = this.codeAnalyzer.importService.getNamedImportBindingsForImportDeclaration(existingImport);

									// If it has, simply add the default import immediately before them
									if (namedBindings != null) {
										context.container.prependLeft(namedBindings.pos, ` ${importName},`);
									}
								}
							}
						}
						return importName;
					}
				}
			}

			// Otherwise, it is exported as a named export
			else if (match.isNamedExport) {
				// First, check if the existing import is a namespace import
				const namespaceImport = this.codeAnalyzer.importService.getNamespaceImportForImportDeclaration(existingImport);

				// If it is, the import name will be equal to that of a property access on the namespace
				if (namespaceImport != null) {
					return `${this.codeAnalyzer.identifierService.getText(namespaceImport.name)}.${match.hostName}`;
				}

				// Otherwise, check if it is imported by name
				else {
					// Take all named imports for the import declaration
					const namedImports = this.codeAnalyzer.importService.getNamedImportsForImportDeclaration(existingImport);

					// There is already at least one named import from that path.
					if (namedImports != null) {
						// Check if one of them matches the host name
						const matchingNamedImport = namedImports.elements.find(element => this.codeAnalyzer.identifierService.getText(element.name) === match.hostName);

						// None of the imported bindings were the host name. Add it!
						if (matchingNamedImport == null) {
							if (importIfNeeded) {
								const importName = match.hostName;
								if (!compilerOptions.dryRun) {
									context.container.appendLeft(
										namedImports.end - 1, `, ${importName}`
									);
								}
								return importName;
							}
						}

						// The host name were imported. Take that name or that property name alias it has been given (if any)
						else {
							return this.codeAnalyzer.identifierService.getText(matchingNamedImport.name);
						}
					}

					// There are no imported bindings from that path. Change that!
					else {
						if (importIfNeeded) {
							const importName = match.hostName;

							if (!compilerOptions.dryRun) {

								// The path is imported without any bindings
								if (existingImport.importClause == null) {
									context.container.overwrite(
										existingImport.pos, existingImport.end,
										`import {${importName}} from "${this.codeAnalyzer.importService.getPathForImportDeclaration(existingImport)}";\n`
									);
								}

								// Otherwise, overwrite the import but be mindful of reusing whatever content it already has
								else {
									context.container.overwrite(
										existingImport.importClause.pos, existingImport.importClause.end,
										`{${importName}}`
									);
								}
							}
							return importName;
						}
					}
				}
			}
		}
		// Default to returning null
		return null;
	}
}