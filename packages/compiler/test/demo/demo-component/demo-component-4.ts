/*tslint:disable*/
// @ts-ignore
import {templateSrc} from "@fovea/core";
class FooBar extends HTMLElement {
	constructor () {
		super();
		console.log(true);
	}
}
customElements.define("foo-bar", FooBar);