import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {useStaticCSSForHost} from "../../css/static-css/use-static-css-for-host";

/**
 * Registers a host for using the CSS mapped to the given hash
 * @param {string} hash
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @private
 */
export function __useStaticCSS (hash: string, host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	useStaticCSSForHost(host, hash);
}