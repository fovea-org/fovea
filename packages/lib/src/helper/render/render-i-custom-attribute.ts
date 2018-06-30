import {ICustomAttribute} from "@fovea/common";
import {upgradeICustomAttribute} from "../../host/upgrade-i-custom-attribute/upgrade-i-custom-attribute";
import {renderBase} from "./render-base";

/*# IF hasICustomAttributes */

/**
 * Renders the provided host
 * @param {ICustomAttribute} host
 * @private
 */
export function __renderICustomAttribute (host: ICustomAttribute): void {
	renderBase(host, upgradeICustomAttribute(host));
} /*# END IF hasICustomAttributes */