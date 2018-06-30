import {ICustomAttribute} from "@fovea/common";

/*# IF hasICustomAttributes */

/**
 * Returns true if the given item is an ICustomAttribute
 * @param {Node | ICustomAttribute} item
 * @returns {boolean}
 */
export function isICustomAttribute (item: Node|ICustomAttribute): item is ICustomAttribute {
	const cast = <ICustomAttribute> item;
	return cast.___hostElement != null;
} /*# END IF hasICustomAttributes */