import {styleSrc, templateSrc} from "@fovea/core";
import {CheckboxBaseComponent} from "../checkbox/checkbox-base-component";

/**
 * This Custom Element represents a Switch.
 */
@templateSrc("./switch-component.html")
@styleSrc([
	"./switch-component.scss"
])
export class SwitchComponent extends CheckboxBaseComponent {
	/**
	 * A reference to the <div> element representing a thumb inside the local DOM
	 */
	protected $thumb: HTMLDivElement;

	/**
	 * Invoked when the underlying input is focused
	 * @override
	 */
	protected onFocus () {
		this.$thumb.dispatchEvent(new PointerEvent("pointerdown", {bubbles: false, cancelable: true}));
	}

	/**
	 * Invoked when the underlying input is blurred
	 * @override
	 */
	protected onBlur () {
		this.$thumb.dispatchEvent(new PointerEvent("pointerup", {bubbles: false, cancelable: true}));
	}

	/**
	 * Invoked when the Checkbox is toggled based on a non-direct interaction.
	 * For example, from clicking on an associated label
	 * @override
	 */
	protected onToggledFromNonDirectInteraction () {
		this.$thumb.dispatchEvent(new PointerEvent("click"));
		this.dispatchEvent(new PointerEvent("click"));
	}
}