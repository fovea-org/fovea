import {IFoveaHost} from "@fovea/common";
import {upgradeIFoveaHost} from "../../host/upgrade-i-fovea-host/upgrade-i-fovea-host";
import {connectBase} from "./connect-base";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {IFoveaHost} host
 * @private
 */
export function __connectFoveaHost (host: IFoveaHost): void {
	connectBase(host, upgradeIFoveaHost(host));
}