import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Marks a PropertyDeclaration as a prop.
 * @param {T} target
 * @param {string} name
 */
export function prop<T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
}