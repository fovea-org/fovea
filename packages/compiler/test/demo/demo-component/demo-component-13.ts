/*tslint:disable*/
// @ts-ignore
import {onAttributeChange, templateSrc, prop, onBecameVisible, onBecameInvisible, listener} from "@fovea/core";

@templateSrc("./demo-component-1.html")
class Foo extends HTMLElement {
	@prop public bar: string;

	@onAttributeChange("disabled", {target: "this"})
	@listener("click")
	@onBecameVisible()
	@onBecameInvisible()
	onFoo () {
	}
}