import {ICustomAttributeConstructor, IFoveaHostConstructor, IType} from "@fovea/common";
import {PROPS_FOR_HOST} from "../props-for-host/props-for-host/props-for-host";
import {constructType} from "../construct-type/construct-type";

const fallbackType = constructType("any");

/**
 * Gets the type that matches the given prop name
 * @param {ICustomAttributeConstructor | IFoveaHostConstructor} hostCtor
 * @param {string} propName
 * @returns {IType}
 */
export function getTypeForPropName (hostCtor: ICustomAttributeConstructor|IFoveaHostConstructor, propName: string|undefined): IType {
	// Fall back to any if the prop is not defined
	if (propName == null) return fallbackType;

	// Find the prop matching the prop name
	const propForHost = PROPS_FOR_HOST.findValue(hostCtor, value => value.name === propName);

	// Return its type if a match was found - otherwise return the default type
	return propForHost == null ? fallbackType : propForHost.type;
}

/**
 * Returns true if the given type represents a boolean
 * @param {boolean} type
 * @returns {boolean}
 */
export function isBooleanType (type: IType): boolean {
	return type.nonNullableTypes.includes("boolean") || type.nonNullableTypes.includes("true") || type.nonNullableTypes.includes("false");
}