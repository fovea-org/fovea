import {dependsOn, hostAttributes, listener, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {RippleComponent} from "../ripple/ripple-component";
import {FormItemComponent} from "../form-item/form-item-component";
import {KeyboardUtil} from "../../util/keyboard-util";
import {rafScheduler} from "@fovea/scheduler";

/**
 * This Custom Element represents a Slider.
 */
@templateSrc("./slider-component.html")
@styleSrc([
	"./slider-component.scss"
])
@hostAttributes({
	role: "slider"
})
@dependsOn(RippleComponent)
export class SliderComponent extends FormItemComponent {
	/**
	 * How many numerical steps to move when the slider is panned
	 * @type {number}
	 */
	@prop @setOnHost public step: number = 1;

	/**
	 * The minimum numerical value of the slider
	 * @type {number}
	 */
	@prop @setOnHost public min: number = 0;

	/**
	 * The maximum numerical value of the slider
	 * @type {number}
	 */
	@prop @setOnHost public max: number = 100;

	/**
	 * The initial value of the slider
	 * @type {string}
	 */
	@prop public value: string = "50";

	/**
	 * Whether or not the slider is discrete
	 * @type {boolean}
	 */
	@prop @setOnHost public discrete: boolean = false;

	/**
	 * Whether or not the slider has ticks
	 * @type {boolean}
	 */
	@prop @setOnHost public tick: boolean = false;

	/**
	 * Whether or not the value is currently being adjusted
	 * @type {boolean}
	 */
	@setOnHost protected adjusting: boolean = false;

	/**
	 * An auto-generated unique hash to use as the id for the SVG pattern
	 * @type {number?}
	 * @private
	 */
	@prop protected patternId: string = btoa(`${this.constructor.name}-${String(Math.random() * 10000)}`);

	/**
	 * A reference to the child <input /> element
	 * @override
	 * @type {HTMLInputElement}
	 */
	protected $formItem: HTMLInputElement;

	/**
	 * A reference to the <div> element representing the thumb
	 * @type {HTMLDivElement}
	 */
	private readonly $thumb: HTMLDivElement;

	/**
	 * Invoked when the value of the underlying input changes
	 */
	@listener("input", {on: "$formItem"})
	protected onInputValueChanged (): void {
		if (this.value !== this.$formItem.value) {
			this.value = this.$formItem.value;
		}
	}

	/**
	 * Will fire when state-altering pointer events are fired on the host.
	 * Will re-fire the events non-bubbling on the thumb
	 * @param {PointerEvent} e
	 */
	@listener(["pointerdown", "pointerup", "pointercancel"])
	protected onPointerEvent (e: PointerEvent): void {
		this.adjusting = e.type === "pointerdown";
		this.$thumb.dispatchEvent(
			new PointerEvent(e.type, {...(<PointerEventInit> e), bubbles: false})
		);
	}

	/**
	 * Invoked when the underlying input is focused
	 */
	@listener("focus", {on: "$formItem"})
	protected onFocus () {
		if (this.adjusting) return;

		this.adjusting = true;
		this.$thumb.dispatchEvent(new PointerEvent("pointerdown", {bubbles: false, cancelable: true}));
	}

	/**
	 * Invoked when the underlying input is blurred
	 */
	@listener("blur", {on: "$formItem"})
	protected onBlur () {
		this.adjusting = false;
		this.$thumb.dispatchEvent(new PointerEvent("pointerup", {bubbles: false, cancelable: true}));
	}

	/**
	 * When the host component is clicked, make sure to focus the underlying form item
	 */
	@listener("click")
	protected onClicked (): void {
		this.$formItem.focus();
	}

	/**
	 * Invoked when a Keyboard key is pressed down
	 * @param {KeyboardEvent} e
	 */
	@listener("keydown", {on: "$formItem"})
	@listener("keydown")
	protected async onKeyDown (e: KeyboardEvent): Promise<void> {
		// Stop propagation in order to avoid the event from being handled twice (bubbling up rom the form item to the host component)
		e.stopPropagation();
		switch (e.key) {
			case KeyboardUtil.LEFT_ARROW:
			case KeyboardUtil.RIGHT_ARROW:
			case KeyboardUtil.UP_ARROW:
			case KeyboardUtil.DOWN_ARROW:
				await rafScheduler.mutate(() => {
					this.$formItem.focus();
					this.onFocus();
				});
				break;
			case KeyboardUtil.ESCAPE:
				await rafScheduler.mutate(() => {
					this.$formItem.blur();
				});
				break;
		}
	}
}