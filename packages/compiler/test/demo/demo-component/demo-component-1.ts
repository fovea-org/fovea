/*tslint:disable*/
import {prop, styleSrc, templateSrc} from "@fovea/core";

// @ts-ignore

@styleSrc([
	"./demo-component-1.scss"
])
@templateSrc("./demo-component-1.html")
class FooBar extends HTMLElement {
	constructor () {
		super();
		console.log(true);
	}
}

// @ts-ignore
@styleSrc([
	"./demo-component-1.scss",
	"./demo-component-2.scss"
])
// @ts-ignore
class MyComponent extends FooBar {
	@prop value: string = "foo";

	constructor () {
		super();
		console.log(true);
	}

}