import {ICustomAttribute, IFoveaHost, IFoveaHostConstructor, ICustomAttributeConstructor} from "@fovea/common";
import {STATIC_TEMPLATES_FOR_HOST} from "../../template/static-template/static-templates-for-host";
import {ITemplateResult} from "../../template/template-result/template-result/i-template-result";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";

/**
 * Connects all templates for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function __connectTemplates (host: IFoveaHost|ICustomAttribute): void {
	const root = getRootForNode(getHostElementForHost(host));
	if (root == null) return;

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;
	const templates = STATIC_TEMPLATES_FOR_HOST.get(constructor);

	// Now, construct the root nodes and map them to the provided host
	let previousSibling: ITemplateResult|null = null;

	templates.forEach(templateFunction => {
		const nodes = templateFunction();
		if (nodes != null) {
			nodes.forEach(templateNodes => {
				UPGRADED_HOSTS.add(host, ...templateNodes.map(node => {

					// Now, construct it!
					const constructedNode = node.construct({host, owner: root, root, previousSibling});
					previousSibling = constructedNode;
					return constructedNode;
				}));
			});
		}
	});
}