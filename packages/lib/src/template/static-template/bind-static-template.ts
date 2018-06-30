import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {ITemplateResult} from "../template-result/template-result/i-template-result";
import {STATIC_TEMPLATES_FOR_HOST} from "./static-templates-for-host";

/**
 * Binds all static templates for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {ShadowRoot|Element} root
 */
export function bindStaticTemplate (host: IFoveaHost|ICustomAttribute, root: ShadowRoot|Element): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;
	const templates = STATIC_TEMPLATES_FOR_HOST.get(constructor);

	// Now, construct the root nodes and map them to the provided host
	let previousSibling: ITemplateResult|null = null;

	templates.forEach(templateFunction => {
		const nodes = templateFunction();
		if (nodes != null) {
			nodes.forEach(templateNodes => {
				UPGRADED_HOSTS.add(host, ...templateNodes.map(node => {
					const constructedNode = node.construct({host, owner: root, root, previousSibling});
					previousSibling = constructedNode;
					return constructedNode;
				}));
			});
		}
	});
}