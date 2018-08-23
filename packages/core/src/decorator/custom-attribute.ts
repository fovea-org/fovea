import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Marks a class as a Custom Attribute
 * @param {T} target
 * @returns {void}
 */
export function customAttribute<T extends HostDecoratorTarget> (target: T): void {
}