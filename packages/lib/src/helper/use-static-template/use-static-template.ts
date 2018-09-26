import {FoveaHostConstructor} from "@fovea/common";
import {useStaticTemplateForHost} from "../../template/static-template/use-static-template-for-host";

/**
 * Registers a host for using the template mapped to the given hash
 * @param {string} hash
 * @param {FoveaHostConstructor} host
 * @private
 */
export function ___useStaticTemplate (hash: string, host: FoveaHostConstructor): void {
	useStaticTemplateForHost(host, hash);
}