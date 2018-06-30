/*tslint:disable*/
class FooBar extends HTMLElement {
	constructor () {
		super();
		console.log(true);
	}
}
customElements.define("foo-bar", FooBar);