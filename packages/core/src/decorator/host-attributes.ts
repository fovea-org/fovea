import {ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

export interface IHostAttributeValues {
	[key: string]: string|{[key: string]: string};
}

/**
 * Declares the host attributes that will always be placed on the annotated component when constructed
 * @template T
 * @param {object} attributes
 * @returns {(target: T) => void}
 */
export function hostAttributes (attributes: IHostAttributeValues) {
	return function <T extends typeof HTMLElement|ICustomAttributeConstructor> (target: T): void {};
}