import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {addHostPropsForHost} from "../../prop/host-props-for-host/add-host-props-for-host";

/**
 * Registers a property that should bubble up and be set as an attribute on a IFoveaHostConstructor
 * @param {string} name
 * @param {boolean} isStatic
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function ___registerSetOnHost (name: string, isStatic: boolean, host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	addHostPropsForHost(host, {name, isStatic});
}