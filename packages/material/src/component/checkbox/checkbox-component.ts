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
	 * A reference to the main UI element (which in this case, is this itself)
	 * @type {this}
	 */
	protected mainUIElement = this;
}