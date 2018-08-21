import {IEmitBaseOptions} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Registers a prop as an event emitter for an IFoveaHost or ICustomAttribute.
 * @param {Partial<IEmitBaseOptions>} options
 * @returns {Function}
 */
export function emit (options?: Partial<IEmitBaseOptions>) {
	return function<T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}