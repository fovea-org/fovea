import {ICustomAttribute} from "@fovea/common";
import {upgradeICustomAttribute} from "../../host/upgrade-i-custom-attribute/upgrade-i-custom-attribute";
import {connectBase} from "./connect-base";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {ICustomAttribute} host
 * @private
 */
export function __connectCustomAttribute (host: ICustomAttribute): void {
	connectBase(host, upgradeICustomAttribute(host));
}