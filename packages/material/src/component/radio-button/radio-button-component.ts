import {dependsOn, hostAttributes, onChange, styleSrc, templateSrc} from "@fovea/core";
import {CheckboxBaseComponent} from "../checkbox/checkbox-base-component";
import {RippleComponent} from "../ripple/ripple-component";

/**
 * A Map between radio names and RadioButton instances
 * @type {Map<string, Set<RadioButtonComponent>>}
 */
const NAME_TO_RADIO_BUTTONS_MAP: Map<string, Set<RadioButtonComponent>> = new Map();

/**
 * Maps a Radio Button to a specific name
 * @param {string} [name] - If not provided, the radio button will be removed from the Map
 * @param {RadioButtonComponent} radioButton
 */
function mapRadioButtonToName (radioButton: RadioButtonComponent, name?: string): void {
	for (const [currentName, buttonSet] of NAME_TO_RADIO_BUTTONS_MAP.entries()) {
		if (buttonSet.has(radioButton)) {
			buttonSet.delete(radioButton);
			if (buttonSet.size === 0) {
				NAME_TO_RADIO_BUTTONS_MAP.delete(currentName);
			}
		}
	}
	if (name != null) {
		let newSet = NAME_TO_RADIO_BUTTONS_MAP.get(name);
		if (newSet == null) {
			newSet = new Set();
			NAME_TO_RADIO_BUTTONS_MAP.set(name, newSet);
		}
		newSet.add(radioButton);
	}
}

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
	 * Whenever the name changes, update the map between Radio Buttons and names
	 */
	@onChange("name")
	protected onNameChanged () {
		if (this.name != null) {
			mapRadioButtonToName(this, this.name);
		}
	}

	/**
	 * When the component is connected, update the map between Radio Buttons and names
	 */
	protected connectedCallback () {
		super.connectedCallback();
		if (this.name != null) {
			mapRadioButtonToName(this, this.name);
		}
	}

	/**
	 * When the component is disconnected, remove the Radio Button from the map between Radio Buttons and names
	 */
	protected disconnectedCallback () {
		mapRadioButtonToName(this);
	}

	/**
	 * Invoked when the <input> element changes
	 */
	public onInputChange () {
		super.onInputChange();
		this.updateGroup();
	}

	/**
	 * When the RadioButtonComponent is clicked, make sure to toggle all other checkboxes within the named group
	 * @override
	 * @param {MouseEvent} e
	 */
	public onClick (e: MouseEvent) {
		if (this.checked) return;

		super.onClick(e);
		this.updateGroup();
	}

	/**
	 * Updates the RadioButtonGroup
	 */
	private updateGroup (): void {
		if (this.name == null) return;

		const group = NAME_TO_RADIO_BUTTONS_MAP.get(this.name);
		if (group == null || [...group].every(button => !button.checked)) return;
		group.forEach(radioButton => {
			if (radioButton !== this) {
				radioButton.toggle(!this.checked);
			}
		});
	}
}