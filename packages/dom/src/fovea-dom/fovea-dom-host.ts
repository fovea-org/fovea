import {IFoveaDOMResult} from "./i-fovea-dom-result";
import {IDOMTemplator} from "../dom/dom-templator/dom-templator/i-dom-templator";
import {IDOMGenerator} from "../dom/dom-generator/dom-generator/i-dom-generator";
import {IFoveaDOMHost} from "./i-fovea-dom-host";
import {IContext} from "../util/context-util/i-context";
import {IDOMUtil} from "../util/dom-util/i-dom-util";
import {FoveaDOMOptions} from "./i-fovea-dom-options";
import {isEmpty} from "@wessberg/stringutil";

/**
 * FoveaDOMHost generates DOM instructions based on the given template contents..
 */
export class FoveaDOMHost implements IFoveaDOMHost {
	constructor (private readonly domTemplator: IDOMTemplator,
							 private readonly domGenerator: IDOMGenerator,
							 private readonly domUtil: IDOMUtil) {
	}

	/**
	 * Generates DOM instructions based on the given code.
	 * @param {FoveaDOMOptions} options
	 * @returns {Promise<IFoveaDOMResult>}
	 */
	public generate (options: FoveaDOMOptions): IFoveaDOMResult {
		const {dryRun = false} = options;

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
			hasTemplateCustomAttributes: false,
			mode: "template" in options ? "template" : "hostAttributes"
		};

		if ("template" in options) {
			// If a template is given, parse it and generate instructions
			const {template, skipTags = new Set()} = options;
			const {ast} = this.domTemplator.template({template, context});
			return {
				...this.domGenerator.generate({ast, context, skipTags}),
				...context
			};
		}

		else {
			const template = `<${this.domUtil.selfReferenceNodeName} ${Object.entries(options.hostAttributes)
				.map(([attributeName, attributeValue]) => {
					return `${attributeName}${typeof attributeValue === "object" ? "+" : ""}="${typeof attributeValue === "object" ? Object.entries(attributeValue).map(([propertyName, propertyValue]) => `${propertyName}: ${typeof propertyValue === "string" && isEmpty(propertyValue) ? "''" : propertyValue}`).join("; ") : attributeValue}"`;
			}).join(" ")}></${this.domUtil.selfReferenceNodeName}>`;

			const {ast} = this.domTemplator.template({template, context});
			return {
				...this.domGenerator.generate({ast, context, skipTags: new Set()}),
				...context
			};
		}
	}
}