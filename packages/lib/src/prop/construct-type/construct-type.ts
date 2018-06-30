import {IType} from "@fovea/common";

/**
 * Constructs an IType based on the given options
 * @param {string} name
 * @returns {IType}
 */
export function constructType (name: string): IType {
	return {
		nonNullableTypes: [name]
	};
}