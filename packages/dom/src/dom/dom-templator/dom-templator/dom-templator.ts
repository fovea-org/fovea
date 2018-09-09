import {IDOMTemplator} from "./i-dom-templator";
import {IDOMTemplatorOptions} from "./i-dom-templator-options";
import {IDOMTemplatorResult} from "./i-dom-templator-result";
import {IDOMASTImplementation} from "../../dom-ast-implementation/i-dom-ast-implementation";
import {FoveaDOMAst} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IFoveaDOMAstGenerator} from "../../fovea-dom-ast-generator/i-fovea-dom-ast-generator";
import {ITokenizerConstructor} from "../../../html-parser/tokenizer/i-tokenizer";
import {isInCamelCase, isInPascalCase, kebabCase} from "@wessberg/stringutil";

/**
 * A dom-templator can generate a HTMLBodyElement from a template.
 */
export class DOMTemplator implements IDOMTemplator {
	constructor (private readonly domAstImplementation: IDOMASTImplementation,
							 private readonly tokenizerImplementation: ITokenizerConstructor,
							 private readonly foveaDomAstGenerator: IFoveaDOMAstGenerator) {
	}

	/**
	 * Generate an AST from the template
	 * @param {string} template
	 * @param {Set<string>} hostMemberNames
	 * @param {IContext} context
	 * @returns {IDOMTemplatorResult}
	 */
	public template ({template, context}: IDOMTemplatorOptions): IDOMTemplatorResult {
		// Generate an AST from the template. Run in xmlMode to support self-closing tags
		const ast = this.domAstImplementation(template, {xmlMode: true, Tokenizer: this.tokenizerImplementation});
		if (ast.some(element => element == null)) {
			throw new TypeError(`Could not parse the given template:\n${template}.\nPlease check your template for HTML syntax errors`);
		}

		// Convert the DOMAstNodeRaw AST into a FoveaDOMAst AST.
		const results = this.foveaDomAstGenerator.generate({ast, context});

		// kebab-case any camelCase or PascalCase element names
		this.kebabCaseElementNames(results.ast);
		return results;
	}

	/**
	 * Takes all camelCased or PascalCased attribute names and kebab-cases them in-place.
	 * @param {FoveaDOMAst} ast
	 */
	private kebabCaseElementNames (ast: FoveaDOMAst): void {
		ast.forEach(root => {
			switch (root.type) {
				case "native":
				case "custom":
					if (isInCamelCase(root.name) || isInPascalCase(root.name)) {
						root.name = kebabCase(root.name);
					}
					if (root.children.length > 0) this.kebabCaseElementNames(root.children);
					break;
			}
		});
	}

}