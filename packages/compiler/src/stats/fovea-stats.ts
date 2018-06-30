import {IFoveaStats, IImmutableFoveaStats, IMutableFoveaStats} from "./i-fovea-stats";
import {IDeclaredCustomSelector} from "./i-declared-custom-selector";
import {IReferencedCustomSelector} from "@fovea/dom";

/**
 * An class that keeps application-wide stats on whether different constructs are being used.
 * This is especially useful when combined with compiler hints to help tree-shaking things that
 * wouldn't be tree-shakeable otherwise.
 */
export class FoveaStats implements IFoveaStats {
	/**
	 * A Map between file names and their individual stats
	 * @type {Map<string, IMutableFoveaStats>}
	 */
	private readonly fileToStatsMap: Map<string, IMutableFoveaStats> = new Map();

	/**
	 * Returns all declared custom selectors
	 * @returns {IDeclaredCustomSelector[]}
	 */
	public get declaredCustomSelectors (): IDeclaredCustomSelector[] {
		const all = Array.from(this.fileToStatsMap.values());
		if (all.length < 1) return [];
		return all
			.map(stats => stats.declaredCustomSelectors)
			.reduce((first, next) => first.concat(next));
	}

	/**
	 * Returns all referenced custom selectors
	 * @returns {IReferencedCustomSelector[]}
	 */
	public get referencedCustomSelectors (): IReferencedCustomSelector[] {
		const all = Array.from(this.fileToStatsMap.values());
		if (all.length < 1) return [];
		return all
			.map(stats => stats.referencedCustomSelectors)
			.reduce((first, next) => first.concat(next));
	}

	/**
	 * Returns all registered component names
	 * @returns {string[]}
	 */
	public get componentNames (): string[] {
		const all = Array.from(this.fileToStatsMap.values());
		if (all.length < 1) return [];
		return all
			.map(stats => stats.componentNames)
			.reduce((first, next) => first.concat(next));
	}

	/**
	 * Returns true if any file has a 'hasStaticCSS' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasStaticCSS (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasStaticCSS);
	}

	/**
	 * Returns true if any file has a 'hasSyncEvaluations' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasSyncEvaluations (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasSyncEvaluations);
	}

	/**
	 * Returns true if any file has a 'hasAsyncEvaluations' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasAsyncEvaluations (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasAsyncEvaluations);
	}

	/**
	 * Returns true if any file has a 'hasIFoveaHosts' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasIFoveaHosts (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasIFoveaHosts);
	}

	/**
	 * Returns true if any file has a 'hasICustomAttributes' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasICustomAttributes (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasICustomAttributes);
	}

	/**
	 * Returns true if any file has a 'hasHostListeners' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasHostListeners (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasHostListeners);
	}

	/**
	 * Returns true if any file has a 'hasVisibilityObservers' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasVisibilityObservers (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasVisibilityObservers);
	}

	/**
	 * Returns true if any file has a 'hasMutationObservers' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasMutationObservers (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasMutationObservers);
	}

	/**
	 * Returns true if any file has a 'hasChangeObservers' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasChangeObservers (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasChangeObservers);
	}

	/**
	 * Returns true if any file has a 'hasTemplateListeners' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasTemplateListeners (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasTemplateListeners);
	}

	/**
	 * Returns true if any file has a 'hasTemplateCustomAttributes' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasTemplateCustomAttributes (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasTemplateCustomAttributes);
	}

	/**
	 * Returns true if any file has a 'hasTemplateRefs' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasTemplateRefs (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasTemplateRefs);
	}

	/**
	 * Returns true if any file has a 'hasTemplateAttributes' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasTemplateAttributes (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasTemplateAttributes);
	}

	/**
	 * Returns true if any file has a 'hasHostProps' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasHostProps (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasHostProps);
	}

	/**
	 * Returns true if any file has a 'hasProps' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasProps (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasProps);
	}

	/**
	 * Returns true if any file has a 'hasEventEmitters' property value of 'true'
	 * @returns {boolean}
	 */
	public get hasEventEmitters (): boolean {
		return Array.from(this.fileToStatsMap.values()).some(stats => stats.hasEventEmitters);
	}

	/**
	 * Gets the flattened stats for all files
	 * @returns {IImmutableFoveaStats}
	 */
	public get stats (): IImmutableFoveaStats {
		return {
			declaredCustomSelectors: this.declaredCustomSelectors,
			referencedCustomSelectors: this.referencedCustomSelectors,
			componentNames: this.componentNames,
			hasStaticCSS: this.hasStaticCSS,
			hasSyncEvaluations: this.hasSyncEvaluations,
			hasAsyncEvaluations: this.hasAsyncEvaluations,
			hasEventEmitters: this.hasEventEmitters,
			hasHostListeners: this.hasHostListeners,
			hasVisibilityObservers: this.hasVisibilityObservers,
			hasMutationObservers: this.hasMutationObservers,
			hasChangeObservers: this.hasChangeObservers,
			hasHostProps: this.hasHostProps,
			hasICustomAttributes: this.hasICustomAttributes,
			hasIFoveaHosts: this.hasIFoveaHosts,
			hasProps: this.hasProps,
			hasTemplateAttributes: this.hasTemplateAttributes,
			hasTemplateCustomAttributes: this.hasTemplateCustomAttributes,
			hasTemplateListeners: this.hasTemplateListeners,
			hasTemplateRefs: this.hasTemplateRefs
		};
	}

	/**
	 * Sets the 'declaredCustomSelectors' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {IDeclaredCustomSelector[]} customSelectors
	 */
	public setDeclaredCustomSelectors (file: string, customSelectors: IDeclaredCustomSelector[]): void {
		this.getMutableStatsForFile(file).declaredCustomSelectors = customSelectors;
	}

	/**
	 * Sets the 'referencedCustomSelectors' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {IReferencedCustomSelector[]} customSelectors
	 */
	public setReferencedCustomSelectors (file: string, customSelectors: IReferencedCustomSelector[]): void {
		this.getMutableStatsForFile(file).referencedCustomSelectors = customSelectors;
	}

	/**
	 * Sets the 'componentNames' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {string[]} componentNames
	 */
	public setComponentNames (file: string, componentNames: string[]): void {
		this.getMutableStatsForFile(file).componentNames = componentNames;
	}

	/**
	 * Sets the 'hasStaticCSS' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasStaticCSS
	 */
	public setHasStaticCSS (file: string, hasStaticCSS: boolean): void {
		this.getMutableStatsForFile(file).hasStaticCSS = hasStaticCSS;
	}

	/**
	 * Sets the 'hasAsyncEvaluations' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasAsyncEvaluations
	 */
	public setHasAsyncEvaluations (file: string, hasAsyncEvaluations: boolean): void {
		this.getMutableStatsForFile(file).hasAsyncEvaluations = hasAsyncEvaluations;
	}

	/**
	 * Sets the 'hasSyncEvaluations' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasSyncEvaluations
	 */
	public setHasSyncEvaluations (file: string, hasSyncEvaluations: boolean): void {
		this.getMutableStatsForFile(file).hasSyncEvaluations = hasSyncEvaluations;
	}

	/**
	 * Sets the 'hasIFoveaHosts' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasIFoveaHosts
	 */
	public setHasIFoveaHosts (file: string, hasIFoveaHosts: boolean): void {
		this.getMutableStatsForFile(file).hasIFoveaHosts = hasIFoveaHosts;
	}

	/**
	 * Sets the 'hasICustomAttributes' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasICustomAttributes
	 */
	public setHasICustomAttributes (file: string, hasICustomAttributes: boolean): void {
		this.getMutableStatsForFile(file).hasICustomAttributes = hasICustomAttributes;
	}

	/**
	 * Sets the 'hasHostListeners' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasHostListeners
	 */
	public setHasHostListeners (file: string, hasHostListeners: boolean): void {
		this.getMutableStatsForFile(file).hasHostListeners = hasHostListeners;
	}

	/**
	 * Sets the 'hasVisibilityObservers' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasVisibilityObservers
	 */
	public setHasVisibilityObservers (file: string, hasVisibilityObservers: boolean): void {
		this.getMutableStatsForFile(file).hasVisibilityObservers = hasVisibilityObservers;
	}

	/**
	 * Sets the 'hasMutationObservers' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasMutationObservers
	 */
	public setHasMutationObservers (file: string, hasMutationObservers: boolean): void {
		this.getMutableStatsForFile(file).hasMutationObservers = hasMutationObservers;
	}

	/**
	 * Sets the 'hasChangeObservers' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasChangeObservers
	 */
	public setHasChangeObservers (file: string, hasChangeObservers: boolean): void {
		this.getMutableStatsForFile(file).hasChangeObservers = hasChangeObservers;
	}

	/**
	 * Sets the 'hasTemplateListeners' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasTemplateListeners
	 */
	public setHasTemplateListeners (file: string, hasTemplateListeners: boolean): void {
		this.getMutableStatsForFile(file).hasTemplateListeners = hasTemplateListeners;
	}

	/**
	 * Sets the 'hasTemplateCustomAttributes' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasTemplateCustomAttributes
	 */
	public setHasTemplateCustomAttributes (file: string, hasTemplateCustomAttributes: boolean): void {
		this.getMutableStatsForFile(file).hasTemplateCustomAttributes = hasTemplateCustomAttributes;
	}

	/**
	 * Sets the 'hasTemplateRefs' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasTemplateRefs
	 */
	public setHasTemplateRefs (file: string, hasTemplateRefs: boolean): void {
		this.getMutableStatsForFile(file).hasTemplateRefs = hasTemplateRefs;
	}

	/**
	 * Sets the 'hasTemplateAttributes' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasTemplateAttributes
	 */
	public setHasTemplateAttributes (file: string, hasTemplateAttributes: boolean): void {
		this.getMutableStatsForFile(file).hasTemplateAttributes = hasTemplateAttributes;
	}

	/**
	 * Sets the 'hasHostProps' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasHostProps
	 */
	public setHasHostProps (file: string, hasHostProps: boolean): void {
		this.getMutableStatsForFile(file).hasHostProps = hasHostProps;
	}

	/**
	 * Sets the 'hasProps' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasProps
	 */
	public setHasProps (file: string, hasProps: boolean): void {
		this.getMutableStatsForFile(file).hasProps = hasProps;
	}

	/**
	 * Sets the 'hasEventEmitters' property on the IFoveaStats for the given file
	 * @param {string} file
	 * @param {boolean} hasEventEmitters
	 */
	public setHasEventEmitters (file: string, hasEventEmitters: boolean): void {
		this.getMutableStatsForFile(file).hasEventEmitters = hasEventEmitters;
	}

	/**
	 * Gets the IFoveaStats for the given file. If it doesn't exist, it will include it.
	 * @param {string} file
	 * @returns {IImmutableFoveaStats}
	 */
	public getStatsForFile (file: string): IImmutableFoveaStats {
		return <IFoveaStats> this.getMutableStatsForFile(file);
	}

	/**
	 * Sets the IFoveaStats for the given file.
	 * @param {string} file
	 * @param {IImmutableFoveaStats} stats
	 */
	public setStatsForFile (file: string, stats: IImmutableFoveaStats): void {
		this.fileToStatsMap.set(file, stats);
	}

	/**
	 * Clears the IFoveaStats for the given file.
	 * @param {string} file
	 */
	public clearStatsForFile (file: string): void {
		this.fileToStatsMap.delete(file);
	}

	/**
	 * Gets the IFoveaStats for the given file. If it doesn't exist, it will include it.
	 * @param {string} file
	 * @returns {IFoveaStats}
	 */
	private getMutableStatsForFile (file: string): IMutableFoveaStats {
		if (!this.fileToStatsMap.has(file)) this.addFile(file);
		return this.fileToStatsMap.get(file)!;
	}

	/**
	 * Adds the provided file to the map between file names and their IFoveaStats
	 * @param {string} file
	 */
	private addFile (file: string): void {
		this.fileToStatsMap.set(file, {
			declaredCustomSelectors: [],
			referencedCustomSelectors: [],
			componentNames: [],
			hasStaticCSS: false,
			hasSyncEvaluations: false,
			hasAsyncEvaluations: false,
			hasIFoveaHosts: false,
			hasICustomAttributes: false,
			hasEventEmitters: false,
			hasHostListeners: false,
			hasVisibilityObservers: false,
			hasMutationObservers: false,
			hasChangeObservers: false,
			hasHostProps: false,
			hasProps: false,
			hasTemplateListeners: false,
			hasTemplateCustomAttributes: false,
			hasTemplateAttributes: false,
			hasTemplateRefs: false
		});
	}
}