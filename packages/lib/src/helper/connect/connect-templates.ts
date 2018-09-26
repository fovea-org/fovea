import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {STATIC_TEMPLATES_FOR_HOST} from "../../template/static-template/static-templates-for-host";
import {ITemplateResult} from "../../template/template-result/template-result/i-template-result";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";

/**
 * Connects all templates for the given host
 * @param {FoveaHost} host
 */
export function ___connectTemplates (host: FoveaHost): void {
	const root = getRootForNode(host.___hostElement);
	if (root == null) return;

	const constructor = <FoveaHostConstructor> host.constructor;
	const templates = STATIC_TEMPLATES_FOR_HOST.get(constructor);

	// Now, construct the root nodes and map them to the provided host
	let previousSibling: ITemplateResult|null = null;
	for (const templateFunction of templates) {
		const nodes = templateFunction();
		if (nodes == null) continue;

		for (const templateNodes of nodes) {
			UPGRADED_HOSTS.add(host, ...templateNodes.map(node => {

				// Now, construct it!
				const constructedNode = node.construct({host, owner: root, root, previousSibling});
				previousSibling = constructedNode;
				return constructedNode;
			}));
		}
	}
}