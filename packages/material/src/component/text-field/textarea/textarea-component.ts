import {listener, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {TextareaBaseComponent} from "../base/textarea-base-component";

/**
 * This Custom Element represents a Text Area.
 */
@templateSrc([
	"../base/textarea-base-component.html",
	"../base/text-field-base-component.html"
])
@styleSrc([
	"./textarea-component.scss"
])
export class TextareaComponent extends TextareaBaseComponent {
	/**
	 * The number of visible text lines for the textarea.
	 * @type {boolean}
	 */
	@prop @setOnHost public rows: number|undefined;

	/**
	 * The visible width of the text field, in average character widths.
	 * If it is specified, it must be a positive integer. If it is not specified, the default value is 20.
	 * @type {boolean}
	 */
	@prop @setOnHost public cols: number|undefined;

	/**
	 * Whether or not the textarea may be resized, and if so, how
	 * @type {string}
	 */
	@prop @setOnHost public resize: "horizontal"|"vertical"|"none"|"both"|"revert" = "vertical";

	/**
	 * In order to to capture events while the textarea is being resized, hook up mousemove/mouseup listeners
	 * after a mousedown event. We don't care about touch events here since textareas cannot be sized in the UI on mobile
	 */
	@listener(["mousemove"], {on: "$formItem"})
	protected async onMouseMove (): Promise<void> {
		await this.refreshOutline();
	}
}