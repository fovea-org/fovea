import {listener, prop, setOnHost} from "@fovea/core";

/**
 * This Custom Element represents a FormItem.
 */
export abstract class FormItemComponent extends HTMLElement {

	/**
	 * Holds true if the FormItem should be disabled
	 * @type {boolean}
	 */
	@prop @setOnHost public disabled: boolean = false;

	/**
	 * Holds true if the FormItem should be read only
	 * @type {boolean}
	 */
	@prop @setOnHost public readonly: boolean = false;

	/**
	 * Holds true if the FormItem should be required
	 * @type {boolean}
	 */
	@prop @setOnHost public required: boolean = false;

	/**
	 * Provides a name for the FormItem for use in forms
	 * @type {string?}
	 */
	@prop public name: string|undefined;

	/**
	 * Provides a value name for the FormItem for use in forms
	 * @type {string?}
	 */
	@prop public value: string|undefined;

	/**
	 * Whether or not the Text field is invalid
	 * @type {boolean}
	 */
	@setOnHost protected invalid: boolean = false;

	/**
	 * A reference to the child <input /> element
	 */
	protected $formItem: HTMLInputElement|HTMLOutputElement|HTMLButtonElement|HTMLFieldSetElement|HTMLObjectElement|HTMLSelectElement|HTMLTextAreaElement;

	/**
	 * Delegates to the child input
	 * @returns {string}
	 */
	public get validationMessage (): string {
		return this.$formItem.validationMessage;
	}

	/**
	 * Delegates to the child input
	 * @returns {ValidityState}
	 */
	public get validity (): ValidityState {
		return this.$formItem.validity;
	}

	/**
	 * Delegates to the child input
	 * @returns {boolean}
	 */
	public get willValidate (): boolean {
		return this.$formItem.willValidate;
	}

	/**
	 * Delegates to the child input
	 * @returns {HTMLFormElement | null}
	 */
	public get form (): HTMLFormElement|null {
		return this.$formItem.form;
	}

	/**
	 * Delegates to the child input
	 * @returns {boolean}
	 */
	public checkValidity (): boolean {
		return this.$formItem.checkValidity();
	}

	/**
	 * Delegates to the child input
	 * @param {string} error
	 */
	public setCustomValidity (error: string): void {
		return this.$formItem.setCustomValidity(error);
	}

	/**
	 * Invoked when the Switch is attached to the DOM
	 */
	protected connectedCallback () {
		this.appendChild(this.$formItem);
	}

	/**
	 * Updates the validity of the input
	 */
	protected updateValidity (): void {
		this.invalid = !this.$formItem.validity.valid;
	}

	/**
	 * Invoked when validation-related events are fired on the form item
	 */
	@listener(["valid", "invalid", "input"], {on: "$formItem"})
	protected onValidityEventFired () {
		this.updateValidity();
	}
}