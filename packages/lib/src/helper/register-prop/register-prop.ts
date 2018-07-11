import {ICustomAttributeConstructor, IFoveaHostConstructor, IType} from "@fovea/common";
import {addPropsForHost} from "../../prop/props-for-host/add-props-for-host/add-props-for-host";

/*# IF hasProps */

/**
 * Registers a prop for an IFoveaHostConstructor
 * @param {string} name
 * @param {IType} type
 * @param {boolean} isStatic
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function __registerProp (name: string, type: IType, isStatic: boolean, host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	// Add the prop to the set of props for the host
	addPropsForHost(host, {name, type, isStatic});
} /*# END IF hasProps */