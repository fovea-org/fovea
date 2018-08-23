import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {useStaticTemplateForHost} from "../../template/static-template/use-static-template-for-host";

/**
 * Registers a host for using the template mapped to the given hash
 * @param {string} hash
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @private
 */
export function ___useStaticTemplate (hash: string, host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	useStaticTemplateForHost(host, hash);
}