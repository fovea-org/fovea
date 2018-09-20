import {emit, hostAttributes, listener, onChange, prop, setOnHost} from "@fovea/core";
import {KeyboardUtil} from "../../util/keyboard-util";
import {FormItemComponent} from "../form-item/form-item-component";
import {IS_TOUCH_DEVICE} from "../../util/device-util";

/**
 * This Custom Element represents the base functionality of a Checkbox.
 */
// @ts-ignore
@hostAttributes({
	"aria-checked": "${indeterminate ? 'mixed' : checked ? 'true' : 'false'}",
	tabindex: "${readonly || disabled ? '-1' : '0'}",
	name: "${name}",
	value: "${value}",
	role: "checkbox"
})
export abstract class CheckboxBaseComponent extends FormItemComponent {
	/**
	 * Holds true if the Checkbox is currently checked
	 * @type {boolean}
	 */
	@prop @setOnHost @emit({name: "checked"}) public checked: boolean = false;

	/**
	 * Holds true if the Checkbox is in an indeterminate state
	 * @type {boolean}
	 */
	@prop @setOnHost public indeterminate: boolean = false;

	/**
	 * A reference to the child <input /> element
	 */
	protected $formItem: HTMLInputElement;

	/**
	 * Delegates to the child input
	 * @returns {boolean}
	 */
	public get defaultChecked (): boolean {
		return this.$formItem.defaultChecked;
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
	 * Invoked when the <input> element changes
	 */
	@listener("change", {on: "$formItem"})
	public onInputChange () {
		this.checked = this.$formItem.checked;
	}

	/**
	 * Invoked when a Keyboard key is pressed down
	 * @param {KeyboardEvent} e
	 */
	@listener("keydown")
	protected onKeyUp (e: KeyboardEvent) {
		switch (e.key) {
			case KeyboardUtil.SPACEBAR:
				e.preventDefault();
				e.stopPropagation();
				this.onToggledFromNonDirectInteraction();
				break;
		}
	}

	/**
	 * Invoked when the Checkbox is toggled based on a non-direct interaction.
	 * For example, from clicking on an associated label
	 */
	protected abstract onToggledFromNonDirectInteraction (): void;

	/**
	 * Invoked when the component is clicked
	 * @param {MouseEvent} e
	 */
	@listener("click")
	public onClick (e: MouseEvent) {

		// Prevent the host element from having click events capturable by the child input since it may repeat the same actions
		if (e.target !== this.$formItem) {
			e.preventDefault();
			e.stopPropagation();
		}

		else {
			this.onToggledFromNonDirectInteraction();
		}

		this.toggle();
	}

	/**
	 * Toggles the 'checked' state
	 */
	public toggle (toggled: boolean = !this.checked): void {
		if (this.disabled || this.readonly) return;

		// Switch off the indeterminate nature of the Checkbox when toggled
		if (this.indeterminate) {
			this.indeterminate = false;
		}
		this.checked = toggled;
	}

	/**
	 * Invoked when the value of 'indeterminate' changes
	 */
	@onChange("indeterminate")
	protected onIndeterminateChanged () {
		this.$formItem.indeterminate = this.indeterminate;
	}

	/**
	 * Invoked when the underlying input is focused
	 */
	@listener("focus", {condition: !IS_TOUCH_DEVICE})
	protected onFocus () {
		this.dispatchEvent(new PointerEvent("pointerdown", {bubbles: false, cancelable: true}));
	}

	/**
	 * Invoked when the underlying input is blurred
	 */
	@listener("blur", {condition: !IS_TOUCH_DEVICE})
	protected onBlur () {
		this.dispatchEvent(new PointerEvent("pointerup", {bubbles: false, cancelable: true}));
	}
}