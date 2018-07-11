/*tslint:disable*/
// @ts-ignore
import {listener} from "@fovea/core";

class Foo extends HTMLElement {
	public bar: string;

	@listener("click")
	@listener("whatever")
	onFoo () {
	}
}