import {FoveaHostConstructor} from "@fovea/common";
import {STATIC_TEMPLATES_FOR_HOST} from "./static-templates-for-host";
import {HASH_TO_TEMPLATES} from "./hash-to-templates";

/**
 * Finds the TemplateNodes matching the provided hash and maps them to the host.
 * @param {FoveaHostConstructor} host
 * @param {string} hash
 */
export function useStaticTemplateForHost (host: FoveaHostConstructor, hash: string): void {
	STATIC_TEMPLATES_FOR_HOST.add(host, () => HASH_TO_TEMPLATES.get(hash));
}