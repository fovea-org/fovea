import {FoveaHostConstructor} from "@fovea/common";
import {useStaticCSSForHost} from "../../css/static-css/use-static-css-for-host";

/**
 * Registers a host for using the CSS mapped to the given hash
 * @param {string} hash
 * @param {FoveaHostConstructor} host
 * @private
 */
export function ___useStaticCSS (hash: string, host: FoveaHostConstructor): void {
	useStaticCSSForHost(host, hash);
}