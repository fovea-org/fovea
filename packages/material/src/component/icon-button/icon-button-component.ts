import {dependsOn, hostAttributes, listener, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {RippleComponent} from "../ripple/ripple-component";
import {IconComponent} from "../icon/icon-component";
import {KeyboardUtil} from "../../util/keyboard-util";
import {IS_TOUCH_DEVICE} from "../../util/device-util";

/**
 * This element represents an icon that acts as a Button
 */
@templateSrc("./icon-button-component.html")
@styleSrc([
	"./icon-button-component.scss"
])
@dependsOn(RippleComponent, IconComponent)
@hostAttributes({
	"*ripple": "center: true",
	role: "button",
	tabindex: 0
})
export class IconButtonComponent extends HTMLElement {

	/**
	 * The selector for the icon to use. The icon must known by the IconComponent
	 * @type {string?}
	 */
	@prop public icon: string|undefined;

	/**
	 * The selector for the icon to use when the IconButtonComponent is toggled. If 'toggleable' is not also provided, this icon will never be used.
	 * @type {string?}
	 */
	@prop public toggledIcon: string|undefined;

	/**
	 * If true, the IconButtonComponent will toggle the 'toggled' attribute on/off for each time it is clicked. If a 'toggledIcon' is provided, it will switch between the provided icons
	 * @type {boolean}
	 */
	@prop public toggleable: boolean = false;

	/**
	 * If true, the IconButtonComponent will be toggled by default
	 * @type {boolean}
	 */
	@prop @setOnHost public toggled: boolean = false;

	/**
	 * If true, the IconButtonComponent will be disabled
	 * @type {boolean}
	 */
	@prop @setOnHost public disabled: boolean = false;

	/**
	 * Invoked when the icon button is clicked
	 */
	@listener("click")
	protected onClicked () {
		if (!this.toggleable) return;
		this.toggled = !this.toggled;
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

				// Fire a click event on itself
				this.dispatchEvent(new MouseEvent("click", {bubbles: false, cancelable: true}));

				break;
		}
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
