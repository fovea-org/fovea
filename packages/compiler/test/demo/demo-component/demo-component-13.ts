/*tslint:disable*/
// @ts-ignore
import {onAttributeChange, templateSrc, prop, onBecameVisible, onBecameInvisible, listener, onChildrenAdded, onChildrenRemoved} from "@fovea/core";

@templateSrc("./demo-component-1.html")
class Foo extends HTMLElement {
	@prop public bar: string;
	styles = ":host {color: red;}";

	@onAttributeChange("disabled", {target: "this"})
	@listener("click")
	@onBecameVisible()
	@onBecameInvisible()
	@onChildrenAdded()
	@onChildrenRemoved()
	onFoo () {
	}
}