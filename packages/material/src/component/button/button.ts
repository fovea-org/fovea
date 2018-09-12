import {customAttribute, dependsOn, hostAttributes, listener, onChildrenAdded, onChildrenRemoved, prop, setOnHost, styleSrc} from "@fovea/core";
import {RippleComponent} from "../ripple/ripple-component";
import {KeyboardUtil} from "../../util/keyboard-util";

/**
 * This Custom Attribute represents a Button
 */
@customAttribute
@styleSrc([
	"./button.scss"
])
@dependsOn(RippleComponent)
@hostAttributes({
	"*ripple": "",
	class: {
		button: true
	}
})
export class Button {
	/**
	 * If true, the Button will have a background color and some elevation
	 * @type {boolean}
	 */
	@prop @setOnHost public contained: boolean = false;

	/**
	 * If true, the Button will have a colored border as well as colored text, but no background color
	 * @type {boolean}
	 */
	@prop @setOnHost public outlined: boolean = false;

	constructor (private readonly hostElement: HTMLElement) {
		this.refresh();
	}

	/**
	 * Invoked when the children changes.
	 * Ensures that all text children are wrapped in elements for styling purposes
	 */
	@onChildrenAdded()
	@onChildrenRemoved()
	private refresh () {
		const childNodes = this.hostElement.childNodes;
		const childNodesLength = childNodes.length;
		for (let i = 0; i < childNodesLength; i++) {
			const node = childNodes[i];
			if (!("style" in node)) {
				const span = document.createElement("span");
				const oldParent = node.parentNode;
				if (oldParent != null) {
					oldParent.replaceChild(span, node);
					span.appendChild(node);
				}
			}
		}
	}

	/**
	 * Invoked when a Keyboard key is pressed down
	 * @param {KeyboardEvent} e
	 */
	@listener("keydown")
	protected onKeyDown (e: KeyboardEvent) {
		switch (e.key) {
			case KeyboardUtil.SPACEBAR:
				// If it is a proper Button element, a 'click' event will already be fired for keyboard events.
				if (this.hostElement instanceof HTMLButtonElement) return;

				// Fire a click event on the button
				this.hostElement.dispatchEvent(new MouseEvent("click", {bubbles: false, cancelable: true}));
				break;
		}
	}
}
