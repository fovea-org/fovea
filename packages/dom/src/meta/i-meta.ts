import {LibHelperName} from "@fovea/common";
import {ISkippedPart} from "./i-skipped-part";
import {IReferencedCustomSelector} from "./i-referenced-custom-selector";

export interface IMeta {
	dryRun: boolean;
	skippedParts: ISkippedPart[];
	referencedCustomSelectors: IReferencedCustomSelector[];
	requiredHelpers: Set<LibHelperName>;
	hasAsyncEvaluations: boolean;
	hasSyncEvaluations: boolean;
	hasTemplateListeners: boolean;
	hasTemplateCustomAttributes: boolean;
	hasTemplateRefs: boolean;
	hasTemplateAttributes: boolean;
}