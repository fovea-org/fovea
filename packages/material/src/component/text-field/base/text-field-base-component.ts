import {hostAttributes, listener, onChange, prop, setOnHost} from "@fovea/core";
import {FormItemComponent} from "../../form-item/form-item-component";

/**
 * This Custom Element represents the base functionality of a Text Field.
 */
// @ts-ignore
@hostAttributes({
	name: "${name}",
	"aria-readonly": "${required}"
})
export abstract class TextFieldBaseComponent extends FormItemComponent {

	/**
	 * Holds true if the Text field should be filled.
	 * The fill color can be set with the CSS Custom property '--fill-color'
	 * @type {boolean}
	 */
	@prop @setOnHost public filled: boolean = false;

	/**
	 * Holds true if the Text field should be outlined
	 * @type {boolean}
	 */
	@prop @setOnHost public outlined: boolean = false;

	/**
	 * The helper text to use within the Text field
	 * @type {string?}
	 */
	@prop @setOnHost public helper: string|undefined;

	/**
	 * The label for the Text Field
	 * @type {string?}
	 */
	@prop @setOnHost public label: string|undefined;

	/**
	 * Whether or not autocomplete should be used for the text field
	 * @type {"on"|"off"|undefined}
	 */
	@prop @setOnHost public autocomplete: "on"|"off"|undefined;

	/**
	 * The maximum amount of input characters
	 * @type {number?}
	 */
	@prop @setOnHost public maxlength: number|undefined;

	/**
	 * The minimum amount of input characters
	 * @type {number?}
	 */
	@prop @setOnHost public minlength: number|undefined;

	/**
	 * The viewBox of the SVG outline
	 * @type {string}
	 */
	@prop protected outlineViewBox: string|undefined;

	/**
	 * The inset within an SVG outline
	 * @type {string}
	 */
	@prop protected outlineInset: number = 16;

	/**
	 * The margin around an outline cutoff
	 * @type {string}
	 */
	@prop protected outlineCutoffMargin: number = 5;

	/**
	 * The radius of the SVG outline
	 * @type {string}
	 */
	@prop protected outlineRadius: number = 4;

	/**
	 * The radius of the SVG outline
	 * @type {string}
	 */
	@prop protected outlineTopPadding: number = 5;

	/**
	 * The border correction of the SVG outline
	 * @type {string}
	 */
	@prop protected outlineBorderCorrection: number = 3;

	/**
	 * The starting coordinate of the SVG outline in the X-axis
	 * @type {string}
	 */
	@prop protected outlineTop: number = this.outlineTopPadding;

	/**
	 * The starting coordinate of the SVG outline in the Y-axis
	 * @type {string}
	 */
	@prop protected outlineLeft: number = this.outlineBorderCorrection;

	/**
	 * The start of the SVG cutoff
	 * @type {string}
	 */
	@prop protected outlineCutoffStart: number|undefined;

	/**
	 * The width of the SVG cutoff
	 * @type {string}
	 */
	@prop protected outlineCutoffWidth: number|undefined;

	/**
	 * The width of the SVG rect
	 * @type {string}
	 */
	@prop protected rectWidth: number|undefined;

	/**
	 * The height of the SVG rect
	 * @type {string}
	 */
	@prop protected rectHeight: number|undefined;

	/**
	 * An auto-generated unique hash to use as the id for the input
	 * @type {number?}
	 * @private
	 */
	@prop protected inputId: string = btoa(`${this.constructor.name}-${String(Math.random() * 10000)}`);

	/**
	 * An auto-generated unique hash to use as the id for the SVG mask
	 * @type {number?}
	 * @private
	 */
	@prop protected maskId: string = btoa(`${this.constructor.name}-${String(Math.random() * 10000)}`);

	/**
	 * Whether or not the Text field is currently focused
	 * @type {boolean}
	 */
	@setOnHost protected focused: boolean = false;

	/**
	 * Whether or not the Text field has any value
	 * @type {boolean}
	 */
	@setOnHost protected hasValue: boolean = false;

	/**
	 * A reference to the child <label> element
	 * @type {HTMLLabelElement}
	 */
	protected $labelItem: HTMLLabelElement;
	protected $outlineMaskRectAnimation: SVGElement;

	/**
	 * A reference to the child input footer element
	 * @type {HTMLLabelElement}
	 */
	protected $inputFooter: HTMLDivElement;

	/**
	 * A reference to the child <input /> element
	 */
	protected $formItem: HTMLInputElement|HTMLTextAreaElement;

	/**
	 * A getter for the 'minlength' property
	 * @returns {number | undefined}
	 */
	public get minLength (): number|undefined {
		return this.minlength;
	}

	/**
	 * A setter for the 'minlength' property
	 * @returns {number | undefined}
	 */
	public set minLength (minLength: number|undefined) {
		this.minlength = minLength;
	}

	/**
	 * A getter for the 'maxlength' property
	 * @returns {number | undefined}
	 */
	public get maxLength (): number|undefined {
		return this.maxlength;
	}

	/**
	 * A setter for the 'maxlength' property
	 * @returns {number | undefined}
	 */
	public set maxLength (maxLength: number|undefined) {
		this.maxlength = maxLength;
	}

	/**
	 * Delegates to the child input
	 * @returns {string}
	 */
	public get defaultValue (): string {
		return this.$formItem.defaultValue;
	}

	/**
	 * Delegates to the child input
	 * @returns {boolean}
	 */
	public get readOnly () {
		return this.$formItem.readOnly;
	}

	/**
	 * Uses it as an alias for 'readonly'
	 * @param {boolean} readOnly
	 */
	public set readOnly (readOnly: boolean) {
		this.readonly = readOnly;
	}

	/**
	 * Invoked when the Switch is attached to the DOM
	 */
	protected connectedCallback () {
		super.connectedCallback();
		this.appendChild(this.$labelItem);
		setTimeout(() => {
			this.refreshComputedInputFooterHeight();
			this.refreshOutline();
		});
	}

	/**
	 * Invoked when an 'input' event is fired on the Text Field
	 */
	@listener("input", {on: "$formItem"})
	public onInputChanged (): void {
		this.value = this.$formItem.value;
	}

	/**
	 * Invoked when the value changes. Toggles 'hasValue'
	 */
	@onChange(["value"])
	protected onValueChanged (): void {
		this.hasValue = this.value != null && this.value.length > 0;
		this.updateValidity();
	}

	/**
	 * Invoked when the underlying Text field is focused
	 */
	@listener("focus", {on: "$formItem"})
	protected onFocus () {
		if (this.focused) return;
		this.focused = true;
	}

	/**
	 * Invoked when the underlying Text field is blurred
	 */
	@listener("blur", {on: "$formItem"})
	protected onBlur () {
		this.focused = false;
	}

	/**
	 * Computes the height of the input footer and sets it as a CSS Custom Property
	 */
	@onChange(["helper", "errorMessage", "invalid"])
	@listener("resize", {on: window})
	protected refreshComputedInputFooterHeight (): void {
		this.style.setProperty("--computed-input-footer-height", `${this.$inputFooter.offsetHeight}px`);
	}

	/**
	 * Refreshes the outline of the text field
	 */
	@onChange(["label", "focused", "outlined", "filled", "invalid"])
	@listener("resize", {on: window})
	protected refreshOutline (): void {
		if (!this.outlined) return;

		const width = this.offsetWidth;
		const helperHeight = parseInt(getComputedStyle(this).getPropertyValue("--computed-input-footer-height"));
		const normalizedHelperHeight = isNaN(helperHeight) ? 0 : helperHeight;
		const height = this.offsetHeight - normalizedHelperHeight;
		if (width < 0 || height < 0) return;

		const labelWidth = this.$labelItem.offsetWidth * 0.75;
		this.outlineCutoffStart = this.outlineInset - this.outlineCutoffMargin;
		this.outlineCutoffWidth = labelWidth === 0 ? 0 : labelWidth + (this.outlineCutoffMargin * 2);
		this.outlineViewBox = `0 0 ${width} ${height}`;
		this.rectWidth = Math.max(0, width - (this.outlineBorderCorrection * 2));
		this.rectHeight = Math.max(0, height - (this.outlineBorderCorrection * 2));
	}
}