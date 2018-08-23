import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Marks a PropertyDeclaration as one that should be set on the host element
 * @param {T} target
 * @param {string} name
 */
export function setOnHost<T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
}