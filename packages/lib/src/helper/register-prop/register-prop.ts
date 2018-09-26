import {FoveaHostConstructor, IType} from "@fovea/common";
import {addPropsForHost} from "../../prop/props-for-host/add-props-for-host/add-props-for-host";

/**
 * Registers a prop for an FoveaHostConstructor
 * @param {string} name
 * @param {IType} type
 * @param {boolean} isStatic
 * @param {FoveaHostConstructor} host
 */
export function ___registerProp (name: string, type: IType, isStatic: boolean, host: FoveaHostConstructor): void {
	// Add the prop to the set of props for the host
	addPropsForHost(host, {name, type, isStatic});
}