import {dependsOn, hostAttributes, styleSrc, templateSrc} from "@fovea/core";
import {RippleComponent} from "../ripple/ripple-component";
import {CheckboxBaseComponent} from "./checkbox-base-component";

/**
 * This Custom Element represents a Checkbox.
 */
@templateSrc("./checkbox-component.html")
@styleSrc([
	"./checkbox-component.scss"
])
@dependsOn(RippleComponent)
@hostAttributes({
	"*ripple": "center: true"
})
export class CheckboxComponent extends CheckboxBaseComponent {

	/**
	 * Invoked when the Checkbox is toggled based on a non-direct interaction.
	 * For example, from clicking on an associated label
	 * @override
	 */
	protected onToggledFromNonDirectInteraction () {
		this.dispatchEvent(new PointerEvent("click"));
	}
}