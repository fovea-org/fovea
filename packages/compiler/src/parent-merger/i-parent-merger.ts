import {IParentMergerMergeOptions} from "./i-parent-merger-merge-options";

export interface IParentMerger {
	merge (options: IParentMergerMergeOptions): void;
}