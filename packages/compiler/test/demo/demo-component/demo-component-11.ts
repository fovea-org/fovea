/*tslint:disable*/
// @ts-ignore
import {prop, hostAttributes} from "@fovea/core";

@hostAttributes({
	"*something": `whatever: ${true}`,
	class: {
		highlight: `${this.bar}`
	},
	style: {
		background: "red"
	}
})
class Foo extends HTMLElement {
	public bar: string;
}