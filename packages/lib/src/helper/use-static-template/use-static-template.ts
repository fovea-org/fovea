import {FoveaHostConstructor, Json} from "@fovea/common";
import {useStaticTemplateForHost} from "../../template/static-template/use-static-template-for-host";

/**
 * Registers a host for using the template mapped to the given hash
 * @param {string} hash
 * @param {Json} _host
 * @private
 */
export function ___useStaticTemplate (hash: string, _host: Json): void {
	const host = _host as FoveaHostConstructor;
	useStaticTemplateForHost(host, hash);
}