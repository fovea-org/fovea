import {listener, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {TextareaBaseComponent} from "../base/textarea-base-component";
import {wait} from "../../../util/async-util";
import {getMsFromCSSDuration} from "../../../util/duration-util";

// tslint:disable:no-any

/**
 * This Custom Element represents a Multi-line Text Field.
 */
@templateSrc([
	"../base/textarea-base-component.html",
	"../base/text-field-base-component.html"
])
@styleSrc([
	"./multi-line-text-field-component.scss"
])
export class MultiLineTextFieldComponent extends TextareaBaseComponent {

	/**
	 * A reference to the last Promise returned from refreshing the height
	 */
	private lastRefreshHeightPromise: Promise<void>|undefined;

	/**
	 * A reference to any active timeout to reset overflow
	 */
	private overflowTimeout: number|undefined;

	/**
	 * Holds true if the text field is currently animating
	 * @type {boolean}
	 */
	@setOnHost private animating: boolean = false;

	/**
	 * Called when 'input' events are fired on the textarea
	 * @override
	 */
	@listener("resize", {on: window})
	@listener(["input", "keyup", "resize"], {on: "$formItem"})
	protected triggerRefreshHeight (): void {
		this.animating
			? this.enqueueRefreshHeight()
			: this.refreshHeight().then();
		this.debounceResetOverflow();
	}

	/**
	 * Resets overflow
	 */
	private resetOverflow (): void {
		this.$formItem.style.overflowY = null;
	}

	/**
	 * Resets overflow debounced such that it may only happen after the value defined by the
	 * CSS Custom Property '--transition-duration'
	 */
	private debounceResetOverflow (): void {
		if (this.overflowTimeout != null) {
			clearTimeout(this.overflowTimeout);
		}

		this.overflowTimeout = <number><any> setTimeout(() => {
			this.resetOverflow();
			this.overflowTimeout = undefined;
		}, getMsFromCSSDuration(getComputedStyle(this).getPropertyValue("--transition-duration")));
	}

	/**
	 * Enqueues a job to refresh the height. If many input events are fired in close proximity,
	 * the jobs should execute in FIFO-order
	 */
	private enqueueRefreshHeight (): void {
		let lastRefreshHeightPromise: Promise<void>|undefined = this.lastRefreshHeightPromise;

		this.lastRefreshHeightPromise = new Promise<void>(async resolve => {
			if (lastRefreshHeightPromise != null) {
				await lastRefreshHeightPromise;
				lastRefreshHeightPromise = undefined;
			}
			resolve(await this.refreshHeight());
		});
	}

	/**
	 * Invoked when a 'scroll' event is fired on the textarea
	 */
	@listener("scroll", {on: "$formItem"})
	protected onScroll (): void {
		this.$formItem.scrollTo(0, 0);
	}

	/**
	 * Refreshes the height of the textarea
	 * @returns {Promise<void>}
	 */
	private async refreshHeight (): Promise<void> {
		if (this.animating) return;
		// Remove transitions to avoid them from affecting the height calculation
		this.animating = false;

		const computedStyle = getComputedStyle(this.$formItem);

		// Take whatever the last height was (if anything)
		const lastHeight = parseInt(computedStyle.getPropertyValue("height"));

		// Set the height to 1px
		this.hideOverflow();
		this.setHeight(1);
		const scrollHeight = this.$formItem.scrollHeight;

		// If the input had a height previously, set it such that the transition will go not from 1px, but from whatever the height was before
		if (lastHeight != null && !isNaN(lastHeight)) {
			this.setHeight(lastHeight);
		}

		// If the last height is identical to the new one, there's nothing more to do
		if (lastHeight == null || isNaN(lastHeight) || lastHeight === scrollHeight) {
			return;
		}

		// Wait a bit
		await wait(20);

		// Otherwise, set 'animating' to true
		this.animating = true;

		this.hideOverflow();
		this.setHeight(scrollHeight);
		setTimeout(async () => {
			this.animating = false;
			// Reset overflow asynchronously to avoid the scrollbar from appearing
			await wait(100);
		}, getMsFromCSSDuration(getComputedStyle(this).getPropertyValue("--transition-duration")));
	}

	/**
	 * Hides overflow and forces recalculation
	 */
	private hideOverflow (): void {
		// Set the overflow to 'hidden' to prevent the scrollbar from rendering whilst resizing
		this.$formItem.style.overflowY = "hidden";
		this.forceRecalculation();
	}

	/**
	 * Forces recalculation of styles
	 */
	private forceRecalculation (): void {
		this.$formItem.offsetHeight;
		this.$formItem.offsetWidth;
	}

	/**
	 * Sets the height of the text area
	 * @param {number | null} height
	 */
	private setHeight (height: number|null): void {
		this.$formItem.style.minHeight = this.$formItem.style.height = height == null ? null : `${height}px`;
	}
}