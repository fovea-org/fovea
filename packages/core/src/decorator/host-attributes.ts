import {IHostAttributeValues} from "@fovea/common";
import {HostDecoratorTarget} from "../host-decorator-target";

/**
 * Declares the host attributes that will always be placed on the annotated component when constructed
 * @template T
 * @param {object} attributes
 * @returns {(target: T) => void}
 */
export function hostAttributes (attributes: IHostAttributeValues) {
	return function <T extends HostDecoratorTarget> (target: T): void {
	};
}