/*tslint:disable*/
// @ts-ignore
import {onAttributeChange, onChange, prop, setOnHost, listener, hostAttributes, emit, onBecameVisible, onBecameInvisible, onChildrenAdded, onChildrenRemoved, styleSrc, templateSrc} from "@fovea/core";

@styleSrc("./demo-component-1.scss")
@templateSrc("./demo-component-1.html")
@hostAttributes({
		foo: "bar",
		"*lolz": "looool",
		style: {
			touchAction: "none"
		}
	})
class Foo extends HTMLElement {
	@prop @setOnHost @emit({name: "foobarbaz"}) public bar: string;

	styles = ":host {color: ${this.bar}; background: green;}";
	template = `<div></div>`;

	@onChange("bar")
	@onAttributeChange("disabled", {target: "this"})
	@listener("click")
	@onBecameVisible()
	@onBecameInvisible()
	@onChildrenAdded()
	@onChildrenRemoved()
	onFoo () {
	}
}