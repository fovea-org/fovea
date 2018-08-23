import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Provides one or more paths to read templates from for a Fovea component
 * @template T
 * @param {string|string[]} src
 * @returns {(target: T) => void}
 */
export function templateSrc (src: string|string[]) {
	return function <T extends HostDecoratorTarget> (target: T): void {
	};
}