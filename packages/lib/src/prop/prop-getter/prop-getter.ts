import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";

/*# IF hasProps */

/**
 * This function is invoked when a value is attempted to be gotten from an IFoveaHost
 * @param {IFoveaHost|IFoveaHostConstructor|ICustomAttribute|ICustomAttributeConstructor} host
 * @param {string} name
 * @returns {Json}
 */
export function propGetter (host: IFoveaHost|IFoveaHostConstructor|ICustomAttribute|ICustomAttributeConstructor, name: string): Json {
	return (<Json>host)[`_${name}`];
} /*# END IF hasProps */