import {Ref} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds a ref to a TemplateElement
 * @param {TemplateElement} child
 * @param {Ref} ref
 * @private
 */
export function __addRef (child: TemplateElement, ref: Ref): void {
	child.addRef(ref);
}