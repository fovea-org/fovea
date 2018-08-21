import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Registers a method as a change callback for when any of the given props change
 * @param {string|string[]} props
 * @param {boolean} [whenAllAreInitialized=false]
 */
export function onChange (props: string[]|string, whenAllAreInitialized: boolean = false) {
	return function <T extends InstanceType<HostDecoratorTarget>> (target: T, name: string): void {
	};
}