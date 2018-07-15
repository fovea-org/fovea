/*tslint:disable*/
// @ts-ignore
import {customAttribute, hostAttributes} from "@fovea/core";

@hostAttributes({
	"*something": `whatever: ${true}`,
	"$foo": "",
	"onclick": `doStuff()`,
	foo: true,
	lolz: 123,
	class: {
		highlight: `${this.bar}`
	},
	style: {
		background: "red"
	}
})
	@customAttribute
class Foo {
	public bar: string;
}