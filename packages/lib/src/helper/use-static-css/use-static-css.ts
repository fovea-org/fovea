import {FoveaHostConstructor, Json} from "@fovea/common";
import {useStaticCSSForHost} from "../../css/static-css/use-static-css-for-host";

/**
 * Registers a host for using the CSS mapped to the given hash
 * @param {string} hash
 * @param {Json} _host
 * @private
 */
export function ___useStaticCSS (hash: string, _host: Json): void {
	const host = _host as FoveaHostConstructor;
	useStaticCSSForHost(host, hash);
}