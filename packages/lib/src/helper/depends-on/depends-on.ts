import {Json} from "@fovea/common";

/**
 * This is a noop that can receive any amount of constructors for a component or a custom attribute.
 * It is used as part of the build-system to ensure that external component dependencies can be imported
 * by named export bindings and will not be tree-shaken from the hosting file
 * @param {...(Json)[]} _components
 * @private
 */
export function ___dependsOn (..._components: (Json)[]): void {
}