/*tslint:disable*/
import {prop} from "@fovea/core";

class Foo extends HTMLElement {
	@prop foo = true;
	@prop bar = "hello World!";
}