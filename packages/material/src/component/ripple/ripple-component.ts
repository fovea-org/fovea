import {customAttribute, hostAttributes, listener, prop, selector, styleSrc} from "@fovea/core";
import {IRippleCoordinates} from "./i-ripple-coordinates";
import {Ripple} from "./ripple";
import {rafScheduler} from "@fovea/scheduler";

/**
 * This Custom Attribute can paint a Ripple on an element
 */
@customAttribute
@selector("ripple")
@styleSrc([
	"./ripple-component.scss"
])
@hostAttributes({
	style: {
		overflow: "hidden",
		position: "relative"
	}
})
export class RippleComponent {
	/**
	 * If true, the Ripple will always transform from the origin of the center of the target element
	 * @type {boolean}
	 */
	@prop public center: boolean = false;

	/**
	 * The Ripple will use the provided color as its background color
	 * @type {string}
	 */
	@prop public color: string = "currentColor";

	/**
	 * If true, the Ripple will be disabled
	 * @type {boolean}
	 */
	@prop public disabled: boolean = false;

	/**
	 * Holds true if the pointer is currently down
	 * @type {boolean}
	 */
	private pointerDown: boolean = false;

	/**
	 * The last constructed Ripple
	 * @type {null}
	 */
	private lastRipple: Ripple|null = null;

	/**
	 * The timestamp of the last pointerdown event
	 * @type {null}
	 */
	private pointerDownTime: number|null = null;

	/**
	 * Whether or not a pointerup followed the pointerdown in quick succession
	 * @type {boolean}
	 */
	private didClick: boolean = false;

	/**
	 * If true, a pointer is currently down on the host element
	 * @type {boolean}
	 */
	private hasPointerSequence: boolean = false;

	/**
	 * A bound reference to the 'onPointerLeave' method
	 * @type {Function}
	 */
	private readonly boundOnPointerLeave = this.onPointerLeave.bind(this);

	constructor (private readonly target: HTMLElement) {
	}

	/**
	 * Invoked when a 'click' event is fired on the target element.
	 * This is useful for when synthetic click events are fired while still preserving the ability
	 * to render a ripple for it
	 */
	@listener("click")
	public onClick () {
		rafScheduler.mutate(async () => {
			if (this.pointerDown || this.disabled || this.hasPointerSequence) return;
			this.pointerDown = true;
			this.pointerDownTime = performance.now();
			this.didClick = true;
			await this.onPointerDownChanged();
			this.onPointerUpOrLeave();
			await this.onPointerDownChanged();
		}).then();
	}

	/**
	 * Invoked when a pointer device is "down" on the target
	 * @param {PointerEvent} e
	 */
	@listener("pointerdown")
	public onPointerDown ({width, height, clientX, clientY, currentTarget}: PointerEvent): void {
		rafScheduler.measure(async () => {
			if (this.disabled || currentTarget == null || !(currentTarget instanceof Element)) return;
			this.didClick = false;
			this.pointerDownTime = performance.now();
			this.pointerDown = true;
			this.hasPointerSequence = true;
			this.addLeaveEventListeners();

			const coordinates = width === -1 && height === -1 ? undefined : (() => {
				const rect = currentTarget.getBoundingClientRect();
				return {
					offsetX: clientX - rect.left,
					offsetY: clientY - rect.top
				};
			})();

			await this.onPointerDownChanged(coordinates);
		}).then();
	}

	/**
	 * Invoked when a pointer device is "up" on the target, or cancels it or leaves it
	 */
	@listener(["pointerup"])
	public onPointerUp (): void {
		rafScheduler.measure(() => {
			if (this.disabled || !this.pointerDown) return;

			this.removeLeaveEventListeners();

			this.didClick = this.pointerDownTime != null && (performance.now() - this.pointerDownTime) < 200;
			this.onPointerUpOrLeave();
			// noinspection JSIgnoredPromiseFromCall
			this.onPointerDownChanged();
		}).then();
	}

	/**
	 * Invoked when a pointer device leaves the target
	 */
	public onPointerLeave (): void {
		rafScheduler.mutate(() => {
			if (this.disabled || !this.pointerDown) return;
			this.didClick = false;
			this.onPointerUpOrLeave();
			this.disposeLastRippleWhenDone();
		}).then();
	}

	/**
	 * Adds event listeners for the "cancel" and "leave" pointer events
	 */
	private addLeaveEventListeners (): void {
		this.target.addEventListener("pointercancel", this.boundOnPointerLeave);
		this.target.addEventListener("pointerout", this.boundOnPointerLeave);
		this.target.addEventListener("pointerleave", this.boundOnPointerLeave);
	}

	/**
	 * Removes event listeners for the "cancel" and "leave" pointer events
	 */
	private removeLeaveEventListeners (): void {
		this.target.removeEventListener("pointercancel", this.boundOnPointerLeave);
		this.target.removeEventListener("pointerout", this.boundOnPointerLeave);
		this.target.removeEventListener("pointerleave", this.boundOnPointerLeave);
	}

	/**
	 * Invoked when the "pointerDown" prop changes its' value
	 * @param {IRippleCoordinates|null} coordinates
	 * @returns {Promise<void>}
	 */
	private async onPointerDownChanged (coordinates?: IRippleCoordinates): Promise<void> {
		if (this.disabled) return;

		// If the pointer is down, create a new ripple and animate it in
		if (this.pointerDown) {
			// If another ripple is already there, make sure to animate it out
			this.disposeLastRipple();

			// Instantiate a new ripple
			this.lastRipple = new Ripple(this.target, this.color);
			// Animate it in. If it was a click, it will automatically dispose it afterwards
			await this.lastRipple.rippleIn(this.center, coordinates);
		}

		// If the pointer has gone up in relation to a click, inform the Ripple that it should clean itself up when it is done animating
		else if (this.didClick) {
			this.disposeLastRippleWhenDone();
		}

		// If the pointer has gone up, and it wasn't related to a click, make sure to dispose of any active ripples
		else {
			this.disposeLastRipple();
		}
	}

	/**
	 * Disposes the ripple that has been most recently constructed
	 */
	private disposeLastRipple (): void {
		if (this.lastRipple != null) {
			this.lastRipple.rippleOut().then();
			this.lastRipple = null;
		}
	}

	/**
	 * Makes sure that the last constructed ripple will be disposed when it is done animating
	 */
	private disposeLastRippleWhenDone (): void {
		if (this.lastRipple != null) {
			this.lastRipple.disposeWhenDone = true;
			this.lastRipple = null;
		}
	}

	/**
	 * Invoked when a pointer device goes "up" on the target, or it leaves it
	 */
	private onPointerUpOrLeave (): void {
		this.pointerDownTime = null;
		this.pointerDown = false;
		// Defer the reset a bit to avoid race conditions with click events
		setTimeout(() => this.hasPointerSequence = false, 100);
	}
}