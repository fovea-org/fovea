import {IVisibilityObserverBaseOptions} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Marks a MethodDeclaration as a callback for when the host element becomes invisible.
 * @param {Partial<IVisibilityObserverBaseOptions>} [options]
 * @returns {Function}
 */
export function onBecameInvisible (options?: Partial<IVisibilityObserverBaseOptions>) {
	return function <T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}