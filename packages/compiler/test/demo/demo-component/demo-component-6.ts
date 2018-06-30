/*tslint:disable*/

class FooComponent extends HTMLElement {
	constructor () {
		super();
	}
}

class BarComponent extends HTMLElement {
	get template () {
		return `<foo-component></foo-component>`;
	}
}