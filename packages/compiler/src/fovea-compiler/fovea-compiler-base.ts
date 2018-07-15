import {IFoveaCompilerCompileOptions} from "./i-fovea-compiler-compile-options";
import {FoveaCompilerCompileResult, ISourceCodeResult} from "./i-fovea-compiler-compile-result";
import {ICodeAnalyzer, IPlacement} from "@wessberg/codeanalyzer";
import {ITemplator} from "../templator/i-templator";
import {IPrototypeExtender} from "../prototype-extender/i-prototype-extender";
import {IFoveaHostMarker} from "../fovea-marker/i-fovea-host-marker";
import {IFoveaHostDefiner} from "../fovea-host-definer/i-fovea-host-definer";
import {IPropExtractor} from "../prop-extractor/i-prop-extractor";
import {ISetOnHostExtractor} from "../set-on-host-extractor/i-set-on-host-extractor";
import {IPropertiesToAttributesMapper} from "../properties-to-attributes-mapper/i-properties-to-attributes-mapper";
import {IConfiguration} from "../configuration/i-configuration";
import {ClassDeclaration, ClassExpression, NodeArray} from "typescript";
import {IFoveaOptions} from "../options/i-fovea-options";
import {IFoveaCompilerBase} from "./i-fovea-compiler-base";
import {IParentMerger} from "../parent-merger/i-parent-merger";
import {IFoveaHostMarkerMarkExcludeResult, IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {FoveaHostKind} from "../fovea-marker/fovea-host-kind";
import {ILibUser} from "../lib-user/i-lib-user";
import {IEmitExtractor} from "../emit-extractor/i-emit-extractor";
import {IHostListenerExtractor} from "../host-listener-extractor/i-host-listener-extractor";
import {IFoveaStats, IImmutableFoveaStats, IMutableFoveaStats} from "../stats/i-fovea-stats";
import {ICompilerHintParser} from "../compiler-hint/compiler-hint-parser/i-compiler-hint-parser";
import {CompilerHintToken} from "../compiler-hint/compiler-hint-token/compiler-hint-token";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IOnChangeExtractor} from "../on-change-extractor/i-on-change-extractor";
import {IVisibilityObserverExtractor} from "../visibility-observer-extractor/i-visibility-observer-extractor";
import {ICompilationContext} from "./i-compilation-context";
import {IDependencyImporter} from "../dependency-importer/i-dependency-importer";
import {FoveaDiagnostic} from "../diagnostics/fovea-diagnostic";
import {IFoveaDiagnostics} from "../diagnostics/i-fovea-diagnostics";
import {IContainerConstructor} from "../container/i-container";
import {IFoveaCompileFileOptions} from "./i-fovea-compile-file-options";
import {IFoveaCompileForeignFileOptions} from "./i-fovea-compile-foreign-file-options";
import {IFoveaUsePrecompiledFileOptions} from "./i-fovea-use-precompiled-file-options";
import {ICompilerFlagsExtender} from "../compiler-flags-extender/i-compiler-flags-extender";
import {IMutationObserverExtractor} from "../mutation-observer-extractor/i-mutation-observer-extractor";
import {libHelperName} from "@fovea/common";
import {IHostAttributesExtractor} from "../host-attributes-extractor/i-host-attributes-extractor";

/**
 * A class that can upgrade source code containing Fovea components
 */
export class FoveaCompilerBase implements IFoveaCompilerBase {

	constructor (private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly foveaStats: IFoveaStats,
							 private readonly foveaDiagnostics: IFoveaDiagnostics,
							 private readonly containerConstructor: IContainerConstructor,
							 private readonly configuration: IConfiguration,
							 private readonly foveaHostMarker: IFoveaHostMarker,
							 private readonly propertiesToAttributesMapper: IPropertiesToAttributesMapper,
							 private readonly propExtractor: IPropExtractor,
							 private readonly hostListenerExtractor: IHostListenerExtractor,
							 private readonly onChangeExtractor: IOnChangeExtractor,
							 private readonly hostAttributesExtractor: IHostAttributesExtractor,
							 private readonly visibilityObserverExtractor: IVisibilityObserverExtractor,
							 private readonly mutationObserverExtractor: IMutationObserverExtractor,
							 private readonly emitExtractor: IEmitExtractor,
							 private readonly setOnHostExtractor: ISetOnHostExtractor,
							 private readonly parentMerger: IParentMerger,
							 private readonly hostDefiner: IFoveaHostDefiner,
							 private readonly dependencyImporter: IDependencyImporter,
							 private readonly compilerHintParser: ICompilerHintParser,
							 private readonly templator: ITemplator,
							 private readonly libUser: ILibUser,
							 private readonly prototypeExtender: IPrototypeExtender,
							 private readonly compilerFlagsExtender: ICompilerFlagsExtender) {
	}

	/**
	 * Gets the flattened stats for all compiled files.
	 * @returns {IImmutableFoveaStats}
	 */
	public get stats (): IImmutableFoveaStats {
		return this.foveaStats.stats;
	}

	/**
	 * Gets the flattened diagnostics for all compiled files.
	 * @returns {FoveaDiagnostic[]}
	 */
	public get diagnostics (): FoveaDiagnostic[] {
		return this.foveaDiagnostics.diagnostics;
	}

	/**
	 * Compiles the given file and code into a proper Fovea component
	 * @param {IFoveaCompilerCompileOptions} opts
	 * @returns {FoveaCompilerCompileResult}
	 */
	public async compile (opts: IFoveaCompilerCompileOptions): Promise<FoveaCompilerCompileResult> {
		const {file, options, code} = opts;

		// Clear diagnostics and stats for the file
		this.foveaDiagnostics.clearDiagnosticsForFile(file);
		this.foveaStats.clearStatsForFile(file);

		// Normalize the options given to Fovea
		const compilerOptions = this.normalizeFoveaCompilerOptions(options);

		// Create a context for the compilation
		const context: ICompilationContext = {
			container: new this.containerConstructor(code, {filename: file, indentExclusionRanges: []}),
			usedLibHelperNames: new Set(),
			propertiesWithAddedPropDecorators: new Set()
		};

		// Treat the input file as a foreign file
		if (this.isForeignFile(file)) {
			await this.compileForeignFile({file, code, compilerOptions, context});
		}

		// Otherwise, treat it as a regular file
		else {
			await this.compileFile({file, code, compilerOptions, context});
		}

		// If we're on a dry run, return a 'hasChanged' value of false no matter what
		if (!context.container.hasChanged) {
			return {hasChanged: false, stats: this.stats, statsForFile: this.foveaStats.getStatsForFile(file), diagnostics: this.diagnostics};
		}

		// Consume the helpers
		this.libUser.consumeHelpers(context);

		const newCode = context.container.toString();

		return {
			hasChanged: context.container.hasChanged,
			context,
			code: newCode,
			map: context.container.generateMap({file: context.container.file, hires: true}),
			stats: this.stats,
			statsForFile: this.foveaStats.getStatsForFile(file),
			diagnostics: this.diagnostics
		};
	}

	/**
	 * Transforms the lib code in respect to the given Compiler comments
	 * @param {string} libCode
	 * @param {string} file
	 * @returns {ISourceCodeResult}
	 */
	public transformCompilerHints (libCode: string, file: string): ISourceCodeResult {
		const newCode = new this.containerConstructor(libCode, {filename: file, indentExclusionRanges: []});
		const ast = this.compilerHintParser.parse(libCode);
		const stats = this.stats;

		ast.forEach(part => {
			switch (part.kind) {
				case CompilerHintToken.IF:
					// If the expression refers to a property that is falsy on the IFoveaStats, remove it from the SourceCode
					if (!part.evaluate(stats)) {
						newCode.remove(part.pos, part.endHint.end);
					}

					// Otherwise, remove both it as well as its end hint - but not the content in-between
					else {
						newCode.remove(part.pos, part.end);
						newCode.remove(part.endHint.pos, part.endHint.end);
					}
					break;
			}
		});
		return {code: newCode.toString(), map: newCode.generateMap({file, hires: true})};
	}

	/**
	 * Returns true if the given file is a foreign file
	 * @param {string} file
	 * @returns {boolean}
	 */
	private isForeignFile (file: string): boolean {
		return this.isStylesFile(file) || this.isTemplateFile(file);
	}

	/**
	 * Returns true if the given file contain a template
	 * @param {string} file
	 * @returns {boolean}
	 */
	private isTemplateFile (file: string): boolean {
		return file.endsWith(".html");
	}

	/**
	 * Returns true if the given file contains styles
	 * @param {string} file
	 * @returns {boolean}
	 */
	private isStylesFile (file: string): boolean {
		return file.endsWith(".scss") || file.endsWith(".sass") || file.endsWith(".less") || file.endsWith(".css");
	}

	/**
	 * Compiles a foreign file, such as a .scss, .css or .html file
	 * @param {IFoveaCompileForeignFileOptions} options
	 * @returns {Promise<void>}
	 */
	private async compileForeignFile ({context, compilerOptions, code}: IFoveaCompileForeignFileOptions): Promise<void> {

		// First, make sure to clear any existing contents of the file
		context.container.remove(0, code.length);

		if (this.isStylesFile(context.container.file)) {
			// Register the styles
			await this.templator.registerStyles({
				compilerOptions,
				shouldExport: true,
				context
			}, code, context.container.file);

		}

		else {
			// Register the template
			await this.templator.registerTemplate({
				compilerOptions,
				shouldExport: true,
				context
			}, code, context.container.file);
		}
	}

	/**
	 * Uses a precompiled file. Obviously, since it is already compiled, there's not much to do besides
	 * parsing and combining its' stats
	 * @param {IFoveaHostMarkerMarkExcludeResult[]} marks
	 * @param {ICompilationContext} context
	 * @returns {Promise<void>}
	 */
	private async usePrecompiledFile ({marks, context}: IFoveaUsePrecompiledFileOptions): Promise<void> {
		// Initialize stats for the file
		const stats: IMutableFoveaStats = this.foveaStats.getStatsForFile(context.container.file);

		// For each mark, take the stats and set them
		for (const mark of marks) {
			const markStats = this.compilerFlagsExtender.getStatsFromCompilerFlagsForComponent(mark);

			if (mark.className != null) {
				const customAttributeRegex = new RegExp(`${libHelperName.registerCustomAttribute}\\s*\\(["'\`]([^"'\`]*)["'\`]\\s*,\\s*${mark.className}`);
				const customElementRegex = new RegExp(`${libHelperName.registerElement}\\s*\\(["'\`]([^"'\`]*)["'\`]\\s*,\\s*${mark.className}`);
				const {isDefaultExport, isNamedExport} = this.hostDefiner.checkHostExportStatus(mark.classDeclaration, mark.className, mark.sourceFile);

				if (!stats.componentNames.includes(mark.className)) {
					stats.componentNames.push(mark.className);
				}

				// If the component is a Custom Attribute, add it to the declared custom selectors of the file
				const customAttributeMatch = mark.sourceFile.text.match(customAttributeRegex);
				if (customAttributeMatch != null) {
					stats.declaredCustomSelectors.push({
						file: context.container.file,
						hostName: mark.className,
						kind: "custom-attribute",
						selector: customAttributeMatch[1],
						isDefaultExport,
						isNamedExport
					});
				}

				else {
					// If the component is a Custom Element, add it to the declared custom selectors of the file
					const customElementMatch = mark.sourceFile.text.match(customElementRegex);
					if (customElementMatch != null) {
						stats.declaredCustomSelectors.push({
							file: context.container.file,
							hostName: mark.className,
							kind: "component",
							selector: customElementMatch[1],
							isDefaultExport,
							isNamedExport
						});
					}
				}
			}

			if (mark.className != null && !stats.componentNames.includes(mark.className)) stats.componentNames.push(mark.className);
			stats.hasStaticCSS = stats.hasStaticCSS || markStats.hasStaticCSS;
			stats.hasHostAttributes = stats.hasHostAttributes || markStats.hasHostAttributes;
			stats.hasSyncEvaluations = stats.hasSyncEvaluations || markStats.hasSyncEvaluations;
			stats.hasAsyncEvaluations = stats.hasAsyncEvaluations || markStats.hasAsyncEvaluations;
			stats.hasIFoveaHosts = stats.hasIFoveaHosts || markStats.hasIFoveaHosts;
			stats.hasICustomAttributes = stats.hasICustomAttributes || markStats.hasICustomAttributes;
			stats.hasHostListeners = stats.hasHostListeners || markStats.hasHostListeners;
			stats.hasVisibilityObservers = stats.hasVisibilityObservers || markStats.hasVisibilityObservers;
			stats.hasMutationObservers = stats.hasMutationObservers || markStats.hasMutationObservers;
			stats.hasChangeObservers = stats.hasChangeObservers || markStats.hasChangeObservers;
			stats.hasTemplateListeners = stats.hasTemplateListeners || markStats.hasTemplateListeners;
			stats.hasTemplateCustomAttributes = stats.hasTemplateCustomAttributes || markStats.hasTemplateCustomAttributes;
			stats.hasTemplateRefs = stats.hasTemplateRefs || markStats.hasTemplateRefs;
			stats.hasTemplateAttributes = stats.hasTemplateAttributes || markStats.hasTemplateAttributes;
			stats.hasHostProps = stats.hasHostProps || markStats.hasHostProps;
			stats.hasProps = stats.hasProps || markStats.hasProps;
			stats.hasEventEmitters = stats.hasEventEmitters || markStats.hasEventEmitters;
		}

		// Finally, set the stats
		this.foveaStats.setStatsForFile(context.container.file, stats);
	}

	/**
	 * Attempt to take all classes for the given file. Return undefined if an exception happens
	 * @param {string} file
	 * @param {string} code
	 * @returns {NodeArray<ClassDeclaration | ClassExpression> | undefined}
	 */
	private takeClassesForFile (file: string, code: string): NodeArray<ClassDeclaration|ClassExpression>|undefined {

		try {
			return this.codeAnalyzer.classService.getAllForFile(file, code, true);
		} catch {
			return undefined;
		}
	}

	/**
	 * Compiles a standard file, such as a .ts or .js file
	 * @returns {Promise<void>}
	 */
	private async compileFile ({file, code, compilerOptions, context}: IFoveaCompileFileOptions): Promise<void> {
		const classes = this.takeClassesForFile(file, code);

		// If there are no classes within the given file, return immediately
		if (classes == null || classes.length < 1) return;

		// If the path should be excluded, return false
		if (this.shouldExcludePath(classes[0].getSourceFile().fileName, compilerOptions)) {
			return;
		}

		// Take all classes that is qualified for compilation (ones that are IFoveaHosts)
		const marks = classes.map(classDeclaration => this.foveaHostMarker.mark({classDeclaration, file}));

		// Take the first precompiled mark
		const precompiledMarks = <IFoveaHostMarkerMarkExcludeResult[]> marks.filter(mark => !mark.include && mark.isPrecompiled);

		// If there is any, *do not* proceed with compilation, but rather use the precompiled file instead
		if (precompiledMarks.length > 0) {
			return await this.usePrecompiledFile({marks: precompiledMarks, context});
		}

		// Otherwise, take those classes that should be included
		const filtered = <IFoveaHostMarkerMarkIncludeResult[]> marks.filter(mark => mark.include);

		// Set the 'hasICustomAttributes' value to true if any of the filtered classes is a Custom Attribute
		this.foveaStats.setHasICustomAttributes(file, filtered.some(mark => mark.kind === FoveaHostKind.CUSTOM_ATTRIBUTE));

		// Set the 'hasIFoveaHosts' value to true if any of the filtered classes is an IFoveaHost
		this.foveaStats.setHasIFoveaHosts(file, filtered.some(mark => mark.kind === FoveaHostKind.HOST));

		// It will have changed if at least 1 class has been included for compilation
		const hasChanged = filtered.length > 0;

		// If it hasn't changed, return immediately
		if (!hasChanged) {
			return;
		}

		// Otherwise, take the first match
		const {sourceFile} = filtered[0];

		// Remove all imports from "@fovea/core".
		if (!compilerOptions.dryRun) {
			const importDeclarations = this.codeAnalyzer.importService.getImportsForPath(this.configuration.foveaModuleName, sourceFile);
			importDeclarations.forEach(importDeclaration => context.container.remove(importDeclaration.pos, importDeclaration.end));
		}

		// Upgrade all of the classes
		for (const mark of filtered) {
			// Unpack it
			const {classDeclaration, kind} = mark;

			// Find its index within the SourceFile
			const indexOfClass = sourceFile.statements.indexOf(<ClassDeclaration> classDeclaration);

			// Take the statement following the ClassDeclaration from the SourceFile
			const nextStatement = sourceFile.statements[indexOfClass + 1];

			// Decide the placement of generated statements. If the class is the last statement of the file, place all generated statements after it. Otherwise, place all generated statements immediately before the next statement of the SourceFile
			const insertPlacement: IPlacement = nextStatement == null ? {node: classDeclaration, position: "AFTER"} : {node: nextStatement, position: "BEFORE"};

			// Define the options that will be provided to underlying services
			const options = {mark, insertPlacement, compilerOptions, context};

			if (kind === FoveaHostKind.CUSTOM_ATTRIBUTE) {

				// Remove the '@customAttribute' decorator that annotates the class
				if (!compilerOptions.dryRun) {
					const decorator = this.codeAnalyzer.classService.getDecorator(this.configuration.preCompile.customAttributeDecoratorName, classDeclaration)!;
					context.container.remove(decorator.pos, decorator.end);
				}
			}

			// Add a call to define the component as a Custom Element
			const defineResult = this.hostDefiner.define(options);

			// If somehow the element could not be defined, return immediately
			if (defineResult == null) continue;

			// Prepare the template of the component
			await this.templator.generateTemplates({...options, generateForStyles: false});

			// Prepare the styles of the component
			await this.templator.generateStyles(options);

			// Prepare the host attributes
			this.hostAttributesExtractor.extract(options);

			// Map properties to attributes
			this.propertiesToAttributesMapper.map(options);

			// Prepare the lifecycle hooks of the component
			this.prototypeExtender.extend(options);

			// Extract the properties annotated with '@setOnHost'
			this.setOnHostExtractor.extract(options);

			// Extract the properties annotated with '@emit'
			this.emitExtractor.extract(options);

			// Extract methods annotated with '@hostListener'
			this.hostListenerExtractor.extract(options);

			// Extract methods annotated with '@onChange'
			this.onChangeExtractor.extract(options);

			// Extract methods annotated with '@onBecameVisible' or '@onBecameInvisible'
			this.visibilityObserverExtractor.extract(options);

			// Extract methods annotated with '@onChildrenAdded' or '@onChildrenRemoved'
			this.mutationObserverExtractor.extract(options);

			// Extract the properties annotated with '@prop'
			this.propExtractor.extract(options);

			// Import the dependencies found within the template (if it has any)
			this.dependencyImporter.importDependencies(options);

			// Add the relevant compiler flags based on the current stats
			this.compilerFlagsExtender.extend(options);

			// Finally, Invoke the relevant parent merger helpers
			this.parentMerger.merge(options);

			// Add the name of the class to the Set of all compiled components
			const {componentNames} = this.foveaStats.getStatsForFile(context.container.file);
			if (!componentNames.includes(mark.className)) {
				componentNames.push(mark.className);
			}
		}
	}

	/**
	 * Gets some normalized FoveaCompilerOptions
	 * @param {Partial<IFoveaCompilerOptions>} userOptions
	 * @returns {IFoveaCompilerOptions}
	 */
	private normalizeFoveaCompilerOptions (userOptions: Partial<IFoveaCompilerOptions> = {}): IFoveaCompilerOptions {
		const env = process.env.NODE_ENV;
		return {
			...userOptions,
			exclude: userOptions.exclude == null ? [] : userOptions.exclude,
			dryRun: userOptions.dryRun == null ? false : userOptions.dryRun,
			production: userOptions.production == null ? env != null && env.toLowerCase() === "production" : userOptions.production,
			postcss: userOptions.postcss == null ? {} : userOptions.postcss
		};
	}

	/**
	 * Returns true if the given path should be excluded
	 * @param {string} path
	 * @param {Partial<IFoveaOptions>} options
	 * @returns {boolean}
	 */
	private shouldExcludePath (path: string, options?: Partial<IFoveaOptions>): boolean {
		// It shouldn't exclude if no options or exclude options are provided
		if (options == null || options.exclude == null) return false;

		// Normalize the globs and regular expressions to test on the path
		const normalizedTests: RegExp[] = options.exclude instanceof RegExp ? [options.exclude] : [...options.exclude];

		// Return true if any of the tests matches the path. If it is a regular expression, match the path with it. Otherwise, match the glob with the path
		return normalizedTests.some(test => test.test(path));
	}
}