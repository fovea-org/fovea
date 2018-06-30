/*tslint:disable*/
import {dependsOn} from "@fovea/core";

class FooComponent extends HTMLElement {
	constructor () {
		super();
	}
}

class BarComponent extends HTMLElement {
	constructor () {
		super();
	}
}

@dependsOn(BarComponent)
class BazComponent extends HTMLElement {
	get template () {
		return `<foo-component></foo-component>`;
	}
}