import {IMutationObserverBaseOptions} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Registers a method as a change callback for when any of the given attribute names change
 * @param {string|string[]} attributes
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 */
export function onAttributeChange (attributes: string[]|string, options?: Partial<IMutationObserverBaseOptions>) {
	return function <T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}