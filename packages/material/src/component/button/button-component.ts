import {dependsOn, hostAttributes, listener, onChildrenAdded, onChildrenRemoved, prop, setOnHost, styleSrc, templateSrc} from "@fovea/core";
import {RippleComponent} from "../ripple/ripple-component";
import {KeyboardUtil} from "../../util/keyboard-util";
import {FormItemComponent} from "../form-item/form-item-component";

/**
 * This Custom Attribute represents a Button
 */
@styleSrc([
	"./button-component.scss"
])
@templateSrc("./button-component.html")
@dependsOn(RippleComponent)
@hostAttributes({
	"*ripple": "color: ${contained ? 'white' : 'currentColor'}",
	role: "button",
	tabindex: "${disabled ? '-1' : '0'}",
	name: "${name}",
	value: "${value}"
})
export class ButtonComponent extends FormItemComponent {

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

	/**
	 * Invoked when the button is connected to the DOM
	 */
	public connectedCallback (): void {
		super.connectedCallback();
		this.refresh().then();
	}

	/**
	 * Invoked when a Keyboard key is pressed down
	 * @param {KeyboardEvent} e
	 */
	@listener("keydown")
	protected onKeyDown (e: KeyboardEvent) {
		switch (e.key) {
			case KeyboardUtil.SPACEBAR:
				e.preventDefault();
				e.stopPropagation();

				// Fire a click event on the button
				this.dispatchEvent(new MouseEvent("click", {bubbles: false, cancelable: true}));
				break;
		}
	}

	/**
	 * Ensures that all text children are wrapped in elements for styling purposes
	 */
	@onChildrenAdded()
	@onChildrenRemoved()
	private async refresh (): Promise<void> {
		const childNodes = this.childNodes;
		const childNodesLength = childNodes.length;
		for (let i = 0; i < childNodesLength; i++) {
			const node = childNodes[i];
			if (!("style" in node)) {
				const span = document.createElement("span");
				const oldParent = node.parentNode;
				if (oldParent != null) {
					if (node.parentNode === oldParent) oldParent.replaceChild(span, node);
					span.appendChild(node);
				}
			}
		}
	}
}
