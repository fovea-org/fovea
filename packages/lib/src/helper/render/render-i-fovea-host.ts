import {IFoveaHost} from "@fovea/common";
import {upgradeIFoveaHost} from "../../host/upgrade-i-fovea-host/upgrade-i-fovea-host";
import {renderBase} from "./render-base";

/*# IF hasIFoveaHosts */

/**
 * Renders the provided host
 * @param {IFoveaHost} host
 * @private
 */
export function __renderIFoveaHost (host: IFoveaHost): void {
	// Add the host to the Set of all connected hosts
	renderBase(host, upgradeIFoveaHost(host));
} /*# END IF hasIFoveaHosts */