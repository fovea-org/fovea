import {IFoveaHost} from "@fovea/common";
import {upgradeIFoveaHost} from "../../host/upgrade-i-fovea-host/upgrade-i-fovea-host";
import {renderBase} from "./render-base";

/**
 * Renders the provided host
 * @param {IFoveaHost} host
 * @private
 */
export function __renderIFoveaHost (host: IFoveaHost): void {
	renderBase(host, upgradeIFoveaHost(host));
}