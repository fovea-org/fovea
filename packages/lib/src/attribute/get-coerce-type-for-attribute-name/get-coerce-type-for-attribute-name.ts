import {constructType} from "../../prop/construct-type/construct-type";
import {getTypeForPropName} from "../../prop/type-for-prop-name/get-type-for-prop-name";
import {getPropNameForAttributeName} from "../../prop/prop-name-to-attribute-name/get-prop-name-for-attribute-name/get-prop-name-for-attribute-name";
import {FoveaHostConstructor, IType} from "@fovea/common";

/**
 * Gets the coerce type to use for an attribute.
 * @param {string} name
 * @param {boolean} append
 * @param {FoveaHostConstructor} hostCtor
 * @returns {IType}
 */
export function getCoerceTypeForAttributeName (name: string, append: boolean, hostCtor: FoveaHostConstructor): IType {
	return name === "style"
		// If the property is a style attribute, the value will always be a string
		? constructType("string")
		: name === "class" && append
			// If the property is a class attribute, the value will always be boolean (to toggle the class on/off)
			? constructType("boolean")
			// Otherwise, attempt to take the type of whatever prop the attribute maps to (if any)
			: getTypeForPropName(hostCtor, getPropNameForAttributeName(name));
}