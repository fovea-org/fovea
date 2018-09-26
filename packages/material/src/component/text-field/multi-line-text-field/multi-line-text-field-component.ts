import {listener, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {TextareaBaseComponent} from "../base/textarea-base-component";
import {getMsFromCSSDuration} from "../../../util/duration-util";
import {debounce, rafScheduler} from "@fovea/scheduler";

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
	 * A reference to resetOverflow with a this-binding
	 * @type {() => void}
	 */
	private boundResetOverflow = this.resetOverflow.bind(this);

	/**
	 * A this-bound reference to the 'handleRefreshHeight' method
	 * @type {Function}
	 */
	private boundHandleRefreshHeight = this.handleRefreshHeight.bind(this);

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
	@listener(["input", "keydown", "resize"], {on: "$formItem"})
	protected async onShouldRefreshHeight (): Promise<void> {
		await rafScheduler.mutate(this.boundHandleRefreshHeight);
	}

	/**
	 * Will refresh the height and later reset overflow
	 * @returns {Promise<void>}
	 */
	private async handleRefreshHeight (): Promise<void> {
		await this.refreshHeight();
		this.debounceResetOverflow();
	}

	/**
	 * Invoked when a 'scroll' event is fired on the textarea
	 */
	@listener("scroll", {on: "$formItem"})
	protected async onScroll (): Promise<void> {
		// Jump onto the animation frame after the next animation frame before invoking the scrollTo operation
		await rafScheduler.mutate(async () => {
			await rafScheduler.mutate(() => this.$formItem.scrollTo(0, 0));
		});
	}

	/**
	 * Resets overflow
	 */
	private async resetOverflow (): Promise<void> {
		await rafScheduler.mutate(() => this.$formItem.style.overflowY = null);
	}

	/**
	 * Resets overflow debounced such that it may only happen after the value defined by the
	 * CSS Custom Property '--transition-duration'
	 */
	private debounceResetOverflow (): void {
		debounce(
			this.boundResetOverflow,
			getMsFromCSSDuration(getComputedStyle(this).getPropertyValue("--transition-duration"))
		);
	}

	/**
	 * Refreshes the height of the textarea
	 * @returns {Promise<void>}
	 */
	private async refreshHeight (): Promise<void> {
		if (this.animating) return;

		const [lastHeight] = await Promise.all([
			rafScheduler.measure(() => {
				const computedStyle = getComputedStyle(this.$formItem);

				// Take whatever the last height was (if anything)
				return parseInt(computedStyle.getPropertyValue("height"));
			}),
			rafScheduler.mutate(() => this.hideOverflow())
		]);

		if (this.animating) return;

		// Set the height to 1px in order to calculate the scroll height. Immediately set the height back to what it was in the same frame
		const scrollHeight = await rafScheduler.mutate(() => {
			this.setHeight(1);
			const _scrollHeight = this.$formItem.scrollHeight;

			// If the input had a height previously, set it such that the transition will go not from 1px, but from whatever the height was before
			if (lastHeight != null && !isNaN(lastHeight)) {
				this.setHeight(lastHeight);
			}

			return _scrollHeight;
		});

		// If the last height is identical to the new one, there's nothing more to do
		if (lastHeight == null || isNaN(lastHeight) || lastHeight === scrollHeight) {
			await rafScheduler.measure(() => this.debounceResetOverflow());
			return undefined;
		}

		if (this.animating) return;

		await rafScheduler.mutate(() => this.animating = true);

		await Promise.all([
			rafScheduler.mutate(() => this.setHeight(scrollHeight)),
			rafScheduler.measure(() => {
				setTimeout(() => {
					this.animating = false;
					this.debounceResetOverflow();
				}, getMsFromCSSDuration(getComputedStyle(this).getPropertyValue("--transition-duration")));
			})
		]);
	}

	/**
	 * Hides overflow and forces recalculation
	 */
	private hideOverflow (): void {
		// Set the overflow to 'hidden' to prevent the scrollbar from rendering whilst resizing
		this.$formItem.style.overflowY = "hidden";
	}

	/**
	 * Sets the height of the text area
	 * @param {number | null} height
	 */
	private setHeight (height: number|null): void {
		this.$formItem.style.minHeight = this.$formItem.style.height = height == null ? null : `${height}px`;
	}
}