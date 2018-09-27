import {dependsOn, hostAttributes, listener, onChange, styleSrc, templateSrc} from "@fovea/core";
import {CheckboxBaseComponent} from "../checkbox/checkbox-base-component";
import {RippleComponent} from "../ripple/ripple-component";
import {findMatchingElementUp} from "../../util/dom-util";

// tslint:disable:no-any

/**
 * This Custom Element represents a Radio Button.
 */
@templateSrc("./radio-button-component.html")
@styleSrc([
	"./radio-button-component.scss"
])
@hostAttributes({
	"*ripple": "center: true",
	role: "radio"
})
@dependsOn(RippleComponent)
export class RadioButtonComponent extends CheckboxBaseComponent {

	/**
	 * A reference to the main UI element (which in this case, is this itself)
	 * @type {this}
	 */
	protected mainUIElement = this;

	/**
	 * Gets the nearest root of the parent, whether it be a Shadow Root or the light DOM of the parent itself
	 * @returns {ShadowRoot | Element}
	 */
	private get parentRoot (): ShadowRoot|Element|null {
		if (this.parentElement == null) return null;
		return (<any>this.parentElement).getRootNode();
	}

	/**
	 * Invoked when the <input> element changes
	 */
	public onInputChange () {
		super.onInputChange();
		this.toggleOffGroupedRadioButtons();
	}

	/**
	 * When the RadioButtonComponent is clicked, make sure to toggle all other checkboxes within the named group
	 * @override
	 * @param {MouseEvent} e
	 */
	@listener("click", {on: "$formItem"})
	public onClick (e: MouseEvent) {
		if (this.checked || this.readonly || this.disabled) return;

		// Re-fire the event on the inner form item
		if (e.target === this) {
			e.stopPropagation();
			e.preventDefault();
			this.$formItem.dispatchEvent(new MouseEvent("click"));
		}

		this.checked = true;
	}

	/**
	 * Toggles off all related radio buttons within the same group (in the current root of the DOM tree)
	 */
	@onChange("name")
	private toggleOffGroupedRadioButtons (): void {
		if (this.name == null || !this.checked) return;

		const parentRoot = this.parentRoot;
		if (parentRoot == null) return;

		// Take all radio buttons for the group. Per the spec, all grouped Radio buttons must be within the same
		// document root, so we only need to look within the current ShadowRoot of the parent
		const radioButtonsInGroup = <RadioButtonComponent[]> [...parentRoot.querySelectorAll(`input[type="radio"][name="${this.name}"]`)]
			.map(radioButton => findMatchingElementUp(RadioButtonComponent, radioButton));

		for (const radioButton of radioButtonsInGroup) {
			if (radioButton === this) continue;
			radioButton.checked = false;
		}
	}
}