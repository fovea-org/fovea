import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {STATIC_CSS_FOR_HOST} from "./static-css-for-host";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {rootHasStaticCSSTemplate} from "./root-has-static-css-template";
import {setStaticCSSTemplateForRoot} from "./set-static-css-template-for-root";
import {setStaticCSSForRoot} from "./set-static-css-for-root";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";

/*# IF hasStaticCSS */

/**
 * Binds all static CSS for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindStaticCSS (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;
	const styles = STATIC_CSS_FOR_HOST.get(constructor);
	const root = getRootForNode(getHostElementForHost(host));
	styles.forEach(templateFunction => {
		const templates = templateFunction();
		if (templates != null) {
			templates.forEach(template => {
				if (!rootHasStaticCSSTemplate(root, template)) {
					const documentFragment = document.importNode(template.content, true);
					setStaticCSSTemplateForRoot(root, template);
					setStaticCSSForRoot(root, documentFragment);
					root.appendChild(documentFragment);
				}
			});
		}
	});
} /*# END IF hasStaticCSS */