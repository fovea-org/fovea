/*tslint:disable*/
// @ts-ignore
import {onAttributeChange, templateSrc, prop, onBecameVisible, onBecameInvisible, listener, onChildrenAdded, onChildrenRemoved, hostAttributes, setOnHost, onChange, styleSrc, dependsOn, selector, emit} from "@fovea/core";

@templateSrc("./demo-component-1.html")
@styleSrc("./demo-component-1.scss")
	@hostAttributes({
		style: {
			color: "red"
		}
	})
@dependsOn(Foo)
@selector("foo-element")
class Foo extends HTMLElement {
	@prop @setOnHost @emit({name: "hehe"}) public bar: string;
	styles = ":host {color: red;}";

	@onAttributeChange("disabled", {target: "this"})
	@listener("click")
	@onBecameVisible()
	@onBecameInvisible()
	@onChildrenAdded()
	@onChildrenRemoved()
	@onChange("bar")
	onFoo () {
	}
}