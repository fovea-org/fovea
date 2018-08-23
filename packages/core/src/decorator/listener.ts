import {IHostListenerBaseOptions} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Registers a method as an event listener for the given event(s) and option(s)
 * @param {string|string[]} events
 * @param {Partial<IHostListenerBaseOptions>} [options]
 * @returns {Function}
 */
export function listener (events: string|string[], options?: Partial<IHostListenerBaseOptions>) {
	return function <T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}