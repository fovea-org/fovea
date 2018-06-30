/*tslint:disable*/
// @ts-ignore
import {customAttribute, selector} from "@fovea/core";

@selector("my-selector")
@customAttribute
export class MyCustomAttribute {
	public value: any;
}