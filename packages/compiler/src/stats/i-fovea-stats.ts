import {IReferencedCustomSelector} from "@fovea/dom";
import {IDeclaredCustomSelector} from "./i-declared-custom-selector";

export interface IMutableCompilerHintStats {
	hasStaticCSS: boolean;
	hasHostAttributes: boolean;
	hasSyncEvaluations: boolean;
	hasAsyncEvaluations: boolean;
	hasIFoveaHosts: boolean;
	hasICustomAttributes: boolean;
	hasHostListeners: boolean;
	hasVisibilityObservers: boolean;
	hasChildListObservers: boolean;
	hasAttributeChangeObservers: boolean;
	hasChangeObservers: boolean;
	hasTemplateListeners: boolean;
	hasTemplateCustomAttributes: boolean;
	hasTemplateRefs: boolean;
	hasTemplateAttributes: boolean;
	hasHostProps: boolean;
	hasProps: boolean;
	hasEventEmitters: boolean;
}

export declare type IImmutableCompilerHintStats = Readonly<IMutableCompilerHintStats>;

export interface IMutableFoveaStats extends IMutableCompilerHintStats {
	declaredCustomSelectors: IDeclaredCustomSelector[];
	referencedCustomSelectors: IReferencedCustomSelector[];
	componentNames: string[];
	fileDependencies: string[];
}

export declare type IImmutableFoveaStats = Readonly<IMutableFoveaStats>;

export interface IFoveaStats extends IImmutableFoveaStats {
	readonly stats: IImmutableFoveaStats;
	getStatsForFile (file: string): IImmutableFoveaStats;
	setStatsForFile (file: string, stats: IImmutableFoveaStats): void;
	clearStatsForFile (file: string): void;
	setDeclaredCustomSelectors (file: string, customSelectors: IDeclaredCustomSelector[]): void;
	setReferencedCustomSelectors (file: string, customSelectors: IReferencedCustomSelector[]): void;
	setFileDependencies (file: string, fileDependencies: string[]): void;
	setComponentNames (file: string, componentNames: string[]): void;
	setHasHostAttributes (file: string, hasHostAttributes: boolean): void;
	setHasStaticCSS (file: string, hasStaticCSS: boolean): void;
	setHasAsyncEvaluations (file: string, hasAsyncEvaluations: boolean): void;
	setHasSyncEvaluations (file: string, hasSyncEvaluations: boolean): void;
	setHasIFoveaHosts (file: string, hasIFoveaHosts: boolean): void;
	setHasICustomAttributes (file: string, hasICustomAttributes: boolean): void;
	setHasHostListeners (file: string, hasHostListeners: boolean): void;
	setHasVisibilityObservers (file: string, hasVisibilityObservers: boolean): void;
	setHasChildListObservers (file: string, hasChildListObservers: boolean): void;
	setHasAttributeChangeObservers (file: string, hasAttributeChangeObservers: boolean): void;
	setHasChangeObservers (file: string, hasChangeObservers: boolean): void;
	setHasTemplateListeners (file: string, hasTemplateListeners: boolean): void;
	setHasTemplateCustomAttributes (file: string, hasTemplateCustomAttributes: boolean): void;
	setHasTemplateRefs (file: string, hasTemplateRefs: boolean): void;
	setHasTemplateAttributes (file: string, hasTemplateAttributes: boolean): void;
	setHasHostProps (file: string, hasHostProps: boolean): void;
	setHasProps (file: string, hasProps: boolean): void;
	setHasEventEmitters (file: string, hasEventEmitters: boolean): void;
}