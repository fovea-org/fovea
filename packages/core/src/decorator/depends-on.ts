import {ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IFoveaHostConstructor} from "@fovea/common";

/**
 * This is a noop that can receive any amount of constructors for a component or a custom attribute.
 * It is used as part of the build-system to ensure that external component dependencies can be imported
 * by named export bindings and will not be tree-shaken from the hosting file
 * @param {...(IFoveaHostConstructor|ICustomAttributeConstructor)[]} components
 */
export function dependsOn (...components: (IFoveaHostConstructor|ICustomAttributeConstructor)[]) {
	return function <T extends typeof HTMLElement|ICustomAttributeConstructor> (target: T): void {};
}