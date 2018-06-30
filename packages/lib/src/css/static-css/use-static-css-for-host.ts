import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {STATIC_CSS_FOR_HOST} from "./static-css-for-host";
import {HASH_TO_CSS_TEMPLATES} from "./hash-to-css-templates";

/*# IF hasStaticCSS */

/**
 * Finds the template matching the provided hash and maps the template to the host.
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {string} hash
 */
export function useStaticCSSForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, hash: string): void {
	STATIC_CSS_FOR_HOST.add(host, () => HASH_TO_CSS_TEMPLATES.get(hash));
} /*# END IF hasStaticCSS */