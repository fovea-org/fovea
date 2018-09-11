import {hostAttributes, listener} from "@fovea/core";
import {TextFieldBaseComponent} from "./text-field-base-component";

/**
 * This Custom Element represents the base functionality of a Textarea or a Multi-line Text Field.
 */
// @ts-ignore
@hostAttributes({
	role: "textbox",
	"aria-multiline": "true"
})
export class TextareaBaseComponent extends TextFieldBaseComponent {

	/**
	 * A reference to the child <input /> element
	 */
	protected $formItem: HTMLTextAreaElement;

	/**
	 * Refreshes the outline
	 * @override
	 */
	@listener(["keyup", "input"], {on: "$formItem"})
	protected refreshOutline (): void {
		super.refreshOutline();
	}
}