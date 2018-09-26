import {FoveaHostConstructor} from "@fovea/common";
import {STATIC_CSS_FOR_HOST} from "./static-css-for-host";
import {HASH_TO_CSS_TEMPLATES} from "./hash-to-css-templates";

/**
 * Finds the template matching the provided hash and maps the template to the host.
 * @param {FoveaHostConstructor} host
 * @param {string} hash
 */
export function useStaticCSSForHost (host: FoveaHostConstructor, hash: string): void {
	STATIC_CSS_FOR_HOST.add(host, () => HASH_TO_CSS_TEMPLATES.get(hash));
}