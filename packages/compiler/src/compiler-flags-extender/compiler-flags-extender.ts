import {ICompilerFlagsExtender} from "./i-compiler-flags-extender";
import {IConfiguration} from "../configuration/i-configuration";
import {ICompilerFlagsExtenderExtendOptions} from "./i-compiler-flags-extender-extend-options";
import {IFoveaStats, IImmutableCompilerHintStats} from "../stats/i-fovea-stats";
import {StringLiteral} from "typescript";
import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {FoveaHostMarkerMarkResult} from "../fovea-marker/fovea-host-marker-mark-result";

/**
 * A class that can extend the prototype of a component with compiler flags
 */
export class CompilerFlagsExtender implements ICompilerFlagsExtender {
	constructor (private readonly codeAnalyzer: ICodeAnalyzer,
							 private readonly configuration: IConfiguration,
							 private readonly stats: IFoveaStats) {
	}

	/**
	 * Extends the prototype of a component with compiler flags
	 * @param {IPrototypeExtenderExtendOptions} options
	 */
	public extend (options: ICompilerFlagsExtenderExtendOptions): void {
		const {mark, compilerOptions, context} = options;

		// Add a (static) getter for observed attributes
		if (!compilerOptions.dryRun) {
			context.container.appendLeft(
				mark.classDeclaration.members.end,
				`\n	public static readonly ${this.configuration.postCompile.compilerFlagsPropName} = "${this.getCompilerFlags(options.context.container.file)}";`
			);
		}
	}

	/**
	 * Gets the compiler flags for a specific file
	 * @param {string} file
	 * @returns {string}
	 */
	public getCompilerFlags (file: string): string {
		const {hasStaticCSS, hasEventEmitters, hasProps, hasHostProps, hasTemplateAttributes, hasTemplateRefs, hasTemplateCustomAttributes, hasTemplateListeners, hasChangeObservers, hasVisibilityObservers, hasMutationObservers, hasHostListeners, hasICustomAttributes, hasIFoveaHosts, hasAsyncEvaluations, hasSyncEvaluations} = this.stats.getStatsForFile(file);
		return ("" +
			Number(hasStaticCSS) +
			Number(hasSyncEvaluations) +
			Number(hasAsyncEvaluations) +
			Number(hasIFoveaHosts) +
			Number(hasICustomAttributes) +
			Number(hasHostListeners) +
			Number(hasVisibilityObservers) +
			Number(hasMutationObservers) +
			Number(hasChangeObservers) +
			Number(hasTemplateListeners) +
			Number(hasTemplateCustomAttributes) +
			Number(hasTemplateRefs) +
			Number(hasTemplateAttributes) +
			Number(hasHostProps) +
			Number(hasProps) +
			Number(hasEventEmitters)
		);
	}

	/**
	 * Gets the stats from some compiler
	 * @param {FoveaHostMarkerMarkResult} mark
	 * @returns {IImmutableCompilerHintStats}
	 */
	public getStatsFromCompilerFlagsForComponent ({classDeclaration, className}: FoveaHostMarkerMarkResult): IImmutableCompilerHintStats {
		const property = this.codeAnalyzer.classService.getStaticPropertyWithName(this.configuration.postCompile.compilerFlagsPropName, classDeclaration);
		let compilerFlagsString: string|null = null;

		// If the property could be found on the class, use it
		if (property != null && property.initializer != null) {
			compilerFlagsString = this.codeAnalyzer.templateExpressionService.stringify(<StringLiteral> property.initializer);
		}

		// Otherwise, the compiler flags may be set on the component later in the SourceFile
		else {
			if (className != null) {
				const fullText = classDeclaration.getSourceFile().text;
				const match = fullText.match(this.getCompilerFlagsRegExp(className));
				if (match != null) {
					// If the flags were found, use them
					compilerFlagsString = match[1];
				}
			}
		}

		if (compilerFlagsString == null) {
			throw new ReferenceError(`Internal Error: No compiler flags was set on the class given to the compiler flags extender`);
		}

		// Take the initialization value and parse all of the flags
		const [hasStaticCSS, hasSyncEvaluations, hasAsyncEvaluations, hasIFoveaHosts, hasICustomAttributes, hasHostListeners, hasVisibilityObservers, hasMutationObservers, hasChangeObservers, hasTemplateListeners, hasTemplateCustomAttributes, hasTemplateRefs, hasTemplateAttributes, hasHostProps, hasProps, hasEventEmitters]: (1|0)[] = compilerFlagsString
			.split("")
			.map(part => <1|0> parseInt(part));

		// Cast all of the values to booleans
		return {
			hasStaticCSS: Boolean(hasStaticCSS),
			hasSyncEvaluations: Boolean(hasSyncEvaluations),
			hasAsyncEvaluations: Boolean(hasAsyncEvaluations),
			hasIFoveaHosts: Boolean(hasIFoveaHosts),
			hasICustomAttributes: Boolean(hasICustomAttributes),
			hasHostListeners: Boolean(hasHostListeners),
			hasVisibilityObservers: Boolean(hasVisibilityObservers),
			hasMutationObservers: Boolean(hasMutationObservers),
			hasChangeObservers: Boolean(hasChangeObservers),
			hasTemplateListeners: Boolean(hasTemplateListeners),
			hasTemplateCustomAttributes: Boolean(hasTemplateCustomAttributes),
			hasTemplateRefs: Boolean(hasTemplateRefs),
			hasTemplateAttributes: Boolean(hasTemplateAttributes),
			hasHostProps: Boolean(hasHostProps),
			hasProps: Boolean(hasProps),
			hasEventEmitters: Boolean(hasEventEmitters)
		};
	}

	/**
	 * Gets a Regular Expression for matching an assignment of Compiler flags to a component
	 * @param {string} className
	 * @returns {RegExp}
	 */
	private getCompilerFlagsRegExp (className: string): RegExp {
		return new RegExp(`${className}\\.${this.configuration.postCompile.compilerFlagsPropName}\\s*=\\s*["'\`]([^"'\`]*)["'\`]`);
	}
}