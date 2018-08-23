import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {STATIC_CSS_FOR_HOST} from "../../css/static-css/static-css-for-host";
import {rootHasStaticCSSTemplate} from "../../css/static-css/root-has-static-css-template";
import {setStaticCSSTemplateForRoot} from "../../css/static-css/set-static-css-template-for-root";
import {setStaticCSSForRoot} from "../../css/static-css/set-static-css-for-root";

/**
 * Connects all CSS for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function ___connectCSS (host: IFoveaHost|ICustomAttribute): void {

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
}