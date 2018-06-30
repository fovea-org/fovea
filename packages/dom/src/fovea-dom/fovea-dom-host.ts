import {IFoveaDOMOptions} from "./i-fovea-dom-options";
import {IFoveaDOMResult} from "./i-fovea-dom-result";
import {IDOMTemplator} from "../dom/dom-templator/dom-templator/i-dom-templator";
import {IDOMGenerator} from "../dom/dom-generator/dom-generator/i-dom-generator";
import {IFoveaDOMHost} from "./i-fovea-dom-host";
import {IContext} from "../util/context-util/i-context";

/**
 * FoveaDOMHost generates DOM instructions based on the given template contents..
 */
export class FoveaDOMHost implements IFoveaDOMHost {
	constructor (private readonly domTemplator: IDOMTemplator,
							 private readonly domGenerator: IDOMGenerator) {
	}

	/**
	 * Generates DOM instructions based on the given code.
	 * @param {string} code
	 * @param {Set<string>} [skipTags=new Set()]
	 * @param {boolean} [dryRun=false]
	 * @returns {Promise<IFoveaDOMResult>}
	 */
	public generate ({template, skipTags = new Set(), dryRun = false}: IFoveaDOMOptions): IFoveaDOMResult {
		// Define a new context
		const context: IContext = {
			dryRun,
			skippedParts: [],
			referencedCustomSelectors: [],
			requiredHelpers: new Set(),
			hasAsyncEvaluations: false,
			hasSyncEvaluations: false,
			hasTemplateListeners: false,
			hasTemplateAttributes: false,
			hasTemplateRefs: false,
			hasTemplateCustomAttributes: false
		};
		const {ast} = this.domTemplator.template({template, context});
		return {
			...this.domGenerator.generate({ast, context, skipTags}),
			...context
		};
	}
}