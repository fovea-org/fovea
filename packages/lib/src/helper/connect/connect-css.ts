import {FoveaHost, FoveaHostConstructor, Json} from "@fovea/common";
import {STATIC_CSS_FOR_HOST} from "../../css/static-css/static-css-for-host";
import {rootHasStaticCSSTemplate} from "../../css/static-css/root-has-static-css-template";
import {setStaticCSSTemplateForRoot} from "../../css/static-css/set-static-css-template-for-root";
import {setStaticCSSForRoot} from "../../css/static-css/set-static-css-for-root";
import {rafScheduler} from "@fovea/scheduler";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";

/**
 * Connects all CSS for the given host
 * @param {Json} _host
 */
export function ___connectCSS (_host: Json): void {
	const host = _host as FoveaHost;
	const constructor = host.constructor as FoveaHostConstructor;
	const styles = STATIC_CSS_FOR_HOST.get(constructor);
	const root = getRootForNode(host.___hostElement);
	styles.forEach(templateFunction => {
		const templates = templateFunction();
		if (templates != null) {
			templates.forEach(async template => {
				if (!rootHasStaticCSSTemplate(root, template)) {
					const documentFragment = document.importNode(template.content, true);
					setStaticCSSTemplateForRoot(root, template);
					setStaticCSSForRoot(root, documentFragment);
					await rafScheduler.mutate(() => root.appendChild(documentFragment), {instantIfFlushing: true, force: true});
				}
			});
		}
	});
}