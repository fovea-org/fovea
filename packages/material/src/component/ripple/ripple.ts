import {IRippleCoordinates} from "./i-ripple-coordinates";

/**
 * A Ripple is a circular shape that fades in/out on a target element
 */
export class Ripple {
	/**
	 * Whether or not the Ripple is currently animating
	 * @type {boolean}
	 */
	private animating: boolean = false;
	/**
	 * How much the circular ripple shape should exceed the dimensions of its container
	 * @type {number}
	 */
	private readonly RIPPLE_OVERFLOW_BUFFER: number = 50;

	/**
	 * How much to shorten the fade in duration before invoking rippleOut()
	 * @type {number}
	 */
	private readonly FADE_IN_DURATION_NEGATIVE_OFFSET: number = 50;

	/**
	 * The constructed element to use as the ripple
	 * @type {HTMLElement}
	 */
	private ripple: HTMLDivElement|null = document.createElement("div");

	/**
	 * These styles will be applied to constructed ripples
	 * @type {object}
	 */
	private readonly rippleBaseStyles: { [key: string]: string } = {
		background: this.color
	};

	constructor (private readonly target: HTMLElement,
							 private readonly color: string) {
	}

	private _disposeWhenDone: boolean = false;

	public get disposeWhenDone () {
		return this._disposeWhenDone;
	}

	public set disposeWhenDone (disposeWhenDone: boolean) {
		this._disposeWhenDone = disposeWhenDone;
		if (!this.animating) this.rippleOut();
	}

	private get root (): ShadowRoot|Element {
		return this.target.shadowRoot != null ? this.target.shadowRoot : this.target;
	}

	public rippleIn (center: boolean, coordinates: IRippleCoordinates|null): void {
		if (this.ripple == null) return;

		Object.assign(
			this.ripple.style,
			this.rippleBaseStyles,
			this.getRippleDimensions(center, coordinates)
		);
		this.ripple.setAttribute("data-ripple", "");
		this.ripple.setAttribute("aria-hidden", "true");

		this.root.appendChild(this.ripple);
		// Force Re-calculating styles
		this.ripple.offsetWidth;
		this.ripple.classList.add("fade-in");
		this.animating = true;

		setTimeout(() => {
			this.animating = false;
			if (this.disposeWhenDone) {
				this.rippleOut();
			}
		}, this.maxDuration - this.FADE_IN_DURATION_NEGATIVE_OFFSET);
	}

	public rippleOut (): void {
		if (this.ripple == null) return;
		this.ripple.classList.replace("fade-in", "fade-out");
		this.animating = true;

		setTimeout(() => {
			this.animating = false;
			if (this.ripple == null) return;
			this.root.removeChild(this.ripple);
			this.ripple = null;
		}, this.maxDuration);
	}

	/**
	 * Gets the max duration for an animation
	 * @returns {number}
	 */
	private get maxDuration (): number {
		if (this.ripple == null) throw new ReferenceError(`Could not get the max duration for a Ripple that hasn't been constructed`);
		const computedStyle = getComputedStyle(this.ripple);
		return Math.max(
			parseFloat(computedStyle.getPropertyValue("--transition-duration-translate")),
			parseFloat(computedStyle.getPropertyValue("--transition-duration-fade"))
		);
	}

	/**
	 * Computes and returns the dimensions that a ripple should be constructed with
	 * @param {boolean} center
	 * @param {IRippleCoordinates|null} coordinates
	 * @returns {{[p: string]: string}}
	 */
	private getRippleDimensions (center: boolean, coordinates: IRippleCoordinates|null): { [key: string]: string } {
		const dimensions = this.computeRippleDimensions(center, coordinates);
		if (dimensions == null) return {};

		const {width, height, size} = dimensions;

		const top = center || coordinates == null
			? (height / 2) - (size / 2)
			: coordinates.offsetY - (size / 2);

		const left = center || coordinates == null
			? (width / 2) - (size / 2)
			: coordinates.offsetX - (size / 2);

		return {
			top: `${top}px`,
			left: `${left}px`,
			width: `${size}px`,
			height: `${size}px`
		};
	}

	/**
	 * Retrieves the dimensions of the target element
	 * @returns {ClientRect | void}
	 */
	private getTargetDimensions (): ClientRect {
		return this.target.getBoundingClientRect();
	}

	/**
	 * Computes the width, height, and size of the ripple to generate based on a pointer event
	 * @param {boolean} center
	 * @param {IRippleCoordinates|null} coordinates
	 * @returns {object | void}
	 */
	private computeRippleDimensions (center: boolean, coordinates: IRippleCoordinates|null): { width: number; height: number; size: number }|void {
		// Get the width and height of the surrounding container.
		// The ripple will always have equal width and height.
		const dimensions = this.getTargetDimensions();

		const {width, height} = dimensions;

		// The size should be equal to the greater of the two axis.
		// Add half of the size to it to make sure that the circle fills the entire square.
		let size = Math.max(width, height) + (Math.max(width, height) / 2);

		// Add in whatever pixels are floating beyond the visible square in relation to the offset position of the pointer event.
		if (coordinates != null && !center) {
			const xDiff = Math.abs((width / 2) - coordinates.offsetX);
			const yDiff = Math.abs((height / 2) - coordinates.offsetY);
			size += xDiff + yDiff + this.RIPPLE_OVERFLOW_BUFFER;
		}
		return {width, height, size};
	}
}