import {styleSrc, templateSrc, listener} from "@fovea/core";
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
	 * A reference to the <div> element representing a thumb inside the local DOM
	 * @type {HTMLDivElement}
	 */
	protected get mainUIElement (): HTMLDivElement {
		return this.$thumb;
	}

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
	 * Invoked when Switch is clicked
	 * @override
	 * @param {MouseEvent} e
	 */
	@listener("click", {on: "$thumb"})
	public onClick (e: MouseEvent) {
		super.onClick(e);
	}
}