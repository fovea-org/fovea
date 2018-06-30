/*tslint:disable*/
import {customAttribute} from "@fovea/core";

@customAttribute
export class MyCustomAttribute {
	public value: any;

	// @ts-ignore
	constructor (hostElement: Element) {}
}