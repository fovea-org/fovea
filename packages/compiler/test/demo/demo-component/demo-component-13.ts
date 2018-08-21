/*tslint:disable*/
// @ts-ignore
import {onAttributeChange, templateSrc} from "@fovea/core";

@templateSrc("./demo-component-1.html")
class Foo extends HTMLElement {
	public bar: string;

	@onAttributeChange("disabled", {target: "this"})
	onFoo () {
	}
}