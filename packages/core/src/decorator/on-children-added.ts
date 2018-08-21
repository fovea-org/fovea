import {IMutationObserverBaseOptions} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Marks a MethodDeclaration as a callback for when the host element or a given target receives children
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 * @returns {Function}
 */
export function onChildrenAdded (options?: Partial<IMutationObserverBaseOptions>) {
	return function <T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}