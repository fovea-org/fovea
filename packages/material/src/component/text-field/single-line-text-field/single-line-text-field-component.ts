import {dependsOn, hostAttributes, onChange, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {TextFieldBaseComponent} from "../base/text-field-base-component";
import {IconComponent} from "../../icon/icon-component";
import {getMsFromCSSDuration} from "../../../util/duration-util";
import {debounce, rafScheduler} from "@fovea/scheduler";

// tslint:disable:no-any

/**
 * This Custom Element represents a Single-line Text Field.
 */
@templateSrc([
	"./single-line-text-field-component.html",
	"../base/text-field-base-component.html"
])
@styleSrc([
	"./single-line-text-field-component.scss"
])
@hostAttributes({
	role: "textbox"
})
@dependsOn(IconComponent)
export class SingleLineTextFieldComponent extends TextFieldBaseComponent {

	/**
	 * The type of input
	 * @type {string}
	 */
	@prop @setOnHost public type: string = "text";

	/**
	 * The 'min' value to use (useful with week, month, date, or time inputs)
	 * @type {string}
	 */
	@prop @setOnHost public min: string;

	/**
	 * The 'max' value to use (useful with week, month, date, or time inputs)
	 * @type {string}
	 */
	@prop @setOnHost public max: string;

	/**
	 * The HTML5 validation pattern to use for the input
	 * @type {string?}
	 */
	@prop @setOnHost public pattern: string|undefined;

	/**
	 * A leading icon to display
	 * @type {string?}
	 */
	@prop @setOnHost public leadingIcon: string|undefined;

	/**
	 * A leading icon to display
	 * @type {string?}
	 */
	@prop @setOnHost public trailingIcon: string|undefined;

	/**
	 * Dictates under which circumstances to display the leading icon. For example, if 'invalid', the leading icon will only be visible when the input is invalid.
	 * @type {string}
	 */
	@prop @setOnHost public leadingIconVisibility: "invalid"|"valid"|"both" = "both";

	/**
	 * Dictates under which circumstances to display the trailing icon. For example, if 'invalid', the trailing icon will only be visible when the input is invalid.
	 * @type {string}
	 */
	@prop @setOnHost public trailingIconVisibility: "invalid"|"valid"|"both" = "both";

	/**
	 * Optionally, the error text to show instead of the helper when the input is invalid
	 */
	@prop @setOnHost public invalidText: string|undefined;

	/**
	 * Whether or not the helper text is currently getting replaced
	 * @type {boolean}
	 */
	@setOnHost protected replacingHelperText: boolean = false;

	/**
	 * A reference to the child <input /> element
	 */
	protected $formItem: HTMLInputElement;

	/**
	 * A reference to the toggleOffReplacingHelperText method with a this-binding
	 */
	private boundToggleOffReplacingHelperText = this.toggleOffReplacingHelperText.bind(this);

	/**
	 * Updates the validity of the input
	 */
	@onChange("type")
	protected onTypeChanged (): void {
		if (this.value != null && this.value.length > 0) {
			this.updateValidity();
		}
	}

	/**
	 * Invoked when the 'invalid' prop changes. Checks if the 'replacingHelperText' property should be toggled (to force an animation of the text change)
	 */
	@onChange("invalid")
	protected async onInvalidChanged (): Promise<void> {
		this.replacingHelperText = this.helper != null && this.invalidText != null;
		if (this.replacingHelperText) {
			await this.debounceToggleOffReplacingHelperText();
		}
	}

	/**
	 * Debounces toggling off the 'replacingHelperText' prop
	 */
	private async debounceToggleOffReplacingHelperText (): Promise<void> {
		await rafScheduler.measure(() => {
			debounce(
				this.boundToggleOffReplacingHelperText,
				getMsFromCSSDuration(getComputedStyle(this).getPropertyValue("--transition-duration"))
			);
		});
	}

	/**
	 * Toggles off the 'replacingHelperText' property
	 */
	private toggleOffReplacingHelperText (): void {
		this.replacingHelperText = false;
	}
}