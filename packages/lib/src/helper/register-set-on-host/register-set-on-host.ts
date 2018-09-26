import {FoveaHostConstructor} from "@fovea/common";
import {addHostPropsForHost} from "../../prop/host-props-for-host/add-host-props-for-host";

/**
 * Registers a property that should bubble up and be set as an attribute on a FoveaHostConstructor
 * @param {string} name
 * @param {boolean} isStatic
 * @param {FoveaHostConstructor} host
 */
export function ___registerSetOnHost (name: string, isStatic: boolean, host: FoveaHostConstructor): void {
	addHostPropsForHost(host, {name, isStatic});
}