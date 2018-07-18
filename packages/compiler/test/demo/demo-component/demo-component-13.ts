/*tslint:disable*/
// @ts-ignore
import {onAttributeChange} from "@fovea/core";

class Foo extends HTMLElement {
	public bar: string;

	@onAttributeChange("disabled", {target: "this"})
	onFoo () {
	}
}