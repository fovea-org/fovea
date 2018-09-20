import {emit, hostAttributes, listener, onChange, onChildrenAdded, onChildrenRemoved, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {getCSSPropertyValue} from "../../util/style-util";
import {getMsFromCSSDuration} from "../../util/duration-util";
import {KeyboardUtil} from "../../util/keyboard-util";
import {DialogAction, DialogOpenState} from "./i-open-dialog-options";
import {debounceUntilIdle} from "../../util/debounce-util";

// tslint:disable:no-identical-functions

/**
 * This element represents a dialog
 */
@templateSrc("./dialog-component.html")
@styleSrc([
	"./dialog-component.scss"
])
@hostAttributes({
	role: "dialog",
	tabindex: 0
})
export class DialogComponent extends HTMLElement {

	/**
	 * The attribute name for action button actions
	 * @type {string}
	 */
	private static readonly DIALOG_ACTION_ATTRIBUTE: string = "dialog-action";
	/**
	 * The attribute name for a dialog footer
	 * @type {string}
	 */
	private static readonly DIALOG_FOOTER_ATTRIBUTE: string = "dialog-footer";

	/**
	 * The attribute name for a dialog header
	 * @type {string}
	 */
	private static readonly DIALOG_HEADER_ATTRIBUTE: string = "dialog-header";

	/**
	 * The attribute name for a dialog article
	 * @type {string}
	 */
	private static readonly DIALOG_ARTICLE_ATTRIBUTE: string = "dialog-article";
	/**
	 * Whether or not the dialog is currently open
	 * @type {boolean}
	 */
	@prop @setOnHost public open: boolean = false;

	/**
	 * Whether or not the dialog is dismissable
	 * @type {boolean}
	 */
	@prop @setOnHost public dismissable: boolean = true;

	/**
	 * Whether or not the dialog will auto-close as a result of actions
	 * @type {boolean}
	 */
	@prop @setOnHost public autoClose: boolean = true;
	/**
	 * Whether or not to use a scrim
	 * @type {boolean}
	 */
	@prop @setOnHost public scrim: boolean = true;
	/**
	 * The current state of the dialog
	 * @type {boolean}
	 */
	@setOnHost @emit() protected state: DialogOpenState = "closed";
	/**
	 * The last dialog action. Will emit an event when it changes
	 * @type {DialogAction}
	 */
	@emit({name: "change"}) protected dialogAction?: DialogAction;
	/**
	 * Whether or not the dialog can scroll
	 * @type {boolean}
	 */
	@setOnHost protected canScroll: boolean = false;

	/**
	 * Whether or not the dialog has a header
	 * @type {boolean}
	 */
	@setOnHost protected hasHeader: boolean = false;
	/**
	 * A reference to the inner <div> element representing the dialog scrim
	 * @type {HTMLDivElement}
	 */
	protected $scrim: HTMLDivElement;
	/**
	 * A reference to the inner <slot> element
	 * @type {HTMLDivElement}
	 */
	protected $slot: HTMLSlotElement;

	/**
	 * Holds the slotted elements for which there has been bound click listeners
	 * @type {Set<HTMLElement>}
	 */
	private slottedChildrenWithClickListeners: Set<HTMLElement> = new Set();

	/**
	 * A this-bound reference to the 'refresh' method
	 * @type {Function}
	 */
	private boundRefresh = this.refresh.bind(this);

	/**
	 * An optional reference to the dialog article element
	 * @type {HTMLElement?}
	 */
	private dialogArticleElement?: HTMLElement;

	/**
	 * A reference to the 'onButtonClicked' method, bound to the scope of this instance
	 */
	private boundOnButtonClicked = this.onButtonClicked.bind(this);

	/**
	 * Invoked when the scrim is clicked
	 */
	@listener("click", {on: "$scrim"})
	protected onScrimClicked (): void {
		if (!this.dismissable || !this.autoClose || !this.open) return;
		this.open = false;
	}

	/**
	 * Invoked when 'open' changes
	 */
	@onChange("open")
	protected onOpenChanged (): void {
		const duration = getMsFromCSSDuration(getCSSPropertyValue(this, "--transition-duration"));

		if (this.open) {
			this.focus();
			this.decideScrollability();

			// Recalculate styles
			this.offsetWidth;

			this.state = "opening";

			setTimeout(() => {
				if (!this.open) return;
				this.state = "open";
			}, duration);
		}

		else {
			if (this.state === "closed") return;
			this.state = "closing";
			setTimeout(() => {
				if (this.open) return;
				this.state = "closed";
			}, duration);
		}
	}

	/**
	 * Invoked when the dialog is attached to the DOM
	 */
	protected connectedCallback (): void {
		this.onSlottedChildrenChanged();
	}

	/**
	 * Invoked when the dialog is detached from the DOM
	 */
	protected disconnectedCallback (): void {
		this.slottedChildrenWithClickListeners.forEach(child => child.removeEventListener("click", this.boundOnButtonClicked));
		this.slottedChildrenWithClickListeners.clear();
	}

	/**
	 * Invoked when the dialog receives slotted children
	 */
	@onChildrenAdded()
	@onChildrenRemoved()
	protected onSlottedChildrenChanged (): void {
		debounceUntilIdle(this.boundRefresh);
	}

	/**
	 * Invoked when a Keyboard key is pressed up
	 * @param {KeyboardEvent} e
	 */
	@listener("keyup")
	protected onKeyUp (e: KeyboardEvent) {
		switch (e.key) {
			case KeyboardUtil.ESCAPE:
				if (!this.dismissable || !this.open) break;
				this.dialogAction = "cancel";
				if (this.autoClose) this.open = false;
				break;
		}
	}

	/**
	 * Refreshes the dialog state based on the slotted children
	 */
	private refresh (): void {
		if (this.$slot == null) return;
		let hasHeader: boolean = false;
		const slottedChildren = this.$slot.assignedNodes();

		// Remove click listeners from removed nodes
		for (const slottedChildWithClickListener of this.slottedChildrenWithClickListeners) {
			if (slottedChildren.every(child => child !== slottedChildWithClickListener && !child.contains(slottedChildWithClickListener))) {
				slottedChildWithClickListener.removeEventListener("click", this.boundOnButtonClicked);
				this.slottedChildrenWithClickListeners.delete(slottedChildWithClickListener);
			}
		}

		// Add relevant click listeners to added nodes
		for (const slottedChild of slottedChildren) {

			if (this.isDialogHeader(slottedChild)) {
				slottedChild.setAttribute(DialogComponent.DIALOG_HEADER_ATTRIBUTE, "");
				hasHeader = true;
			}

			else if (this.isDialogFooter(slottedChild)) {
				slottedChild.setAttribute(DialogComponent.DIALOG_FOOTER_ATTRIBUTE, "");
				for (const footerChild of slottedChild.childNodes) {
					if (
						this.isActionButton(footerChild) &&
						!this.slottedChildrenWithClickListeners.has(footerChild)
					) {
						footerChild.setAttribute(DialogComponent.DIALOG_ACTION_ATTRIBUTE, this.takeDialogActionFromElement(footerChild));
						// This will be a button or an element including a button
						footerChild.addEventListener("click", this.boundOnButtonClicked);
						this.slottedChildrenWithClickListeners.add(footerChild);
					}
				}
			}

			else if (this.isDialogArticle(slottedChild)) {
				slottedChild.setAttribute(DialogComponent.DIALOG_ARTICLE_ATTRIBUTE, "");
				this.dialogArticleElement = slottedChild;
			}
		}

		this.hasHeader = hasHeader;
	}

	/**
	 * Decides whether or not the dialog can scroll
	 */
	private decideScrollability (): void {
		requestAnimationFrame(() => {
			this.canScroll = this.dialogArticleElement == null ? false : this.dialogArticleElement.scrollHeight > this.dialogArticleElement.offsetHeight;
		});
	}

	/**
	 * Takes the dialog action provided by the given button
	 * @param {HTMLElement & {dialogAction?: string}} element
	 * @returns {DialogAction}
	 */
	private takeDialogActionFromElement (element: HTMLElement&{ dialogAction?: string }): DialogAction {
		const attrValue = element.getAttribute(DialogComponent.DIALOG_ACTION_ATTRIBUTE);
		let candidate: string|undefined;
		if (attrValue != null && attrValue.length > 0) {
			candidate = attrValue;
		}

		if (candidate == null) {
			candidate = element.dialogAction;
		}

		if (candidate === "confirm") return "confirm";
		if (candidate === "cancel") return "cancel";
		return "cancel";
	}

	/**
	 * Returns true if the given element represents a dialog header
	 * @param {Node} element
	 * @returns {boolean}
	 */
	private isDialogHeader (element: Node&{ dialogHeader?: boolean }): element is HTMLElement {
		return (
			element.nodeName === "HEADER" ||
			(element instanceof Element && element.hasAttribute(DialogComponent.DIALOG_HEADER_ATTRIBUTE)) ||
			element.dialogHeader === true
		);
	}

	/**
	 * Returns true if the given element represents a dialog article
	 * @param {Node} element
	 * @returns {boolean}
	 */
	private isDialogArticle (element: Node): element is HTMLElement {
		return !this.isDialogHeader(element) && !this.isDialogFooter(element) && !this.isActionButton(element);
	}

	/**
	 * Returns true if the given element represents a dialog footer
	 * @param {Node} element
	 * @returns {boolean}
	 */
	private isDialogFooter (element: Node&{ dialogFooter?: boolean }): element is HTMLElement {
		return (
			element.nodeName === "FOOTER" ||
			(element instanceof Element && element.hasAttribute(DialogComponent.DIALOG_FOOTER_ATTRIBUTE)) ||
			element.dialogFooter === true
		);
	}

	/**
	 * Returns true if the given element represents an action button
	 * @param {Element} element
	 * @returns {boolean}
	 */
	private isActionButton (element: Node&{ dialogAction?: boolean }): element is HTMLElement {
		return (
			element instanceof Element && (
				element.nodeName === "BUTTON" || element.querySelector("button") != null || element.hasAttribute(DialogComponent.DIALOG_ACTION_ATTRIBUTE)) || element.dialogAction != null
		);
	}

	/**
	 * Invoked when one of the action buttons has been clicked
	 * @param {MouseEvent} e
	 */
	private onButtonClicked (e: MouseEvent): void {
		const button = e.currentTarget;
		if (!(button instanceof HTMLElement)) return;

		// Take the dialog action of the button
		const dialogAction = this.takeDialogActionFromElement(button);

		switch (dialogAction) {
			case "confirm":
			case "cancel":
				this.dialogAction = dialogAction;
				if (this.autoClose) this.open = false;
				break;
		}
	}
}