import {ITemplateResult} from "../template-result/i-template-result";
import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {ITemplateResultOptions} from "../template-result/i-template-result-options";
import {setHostForNode} from "../../../host/host-for-node/set-host-for-node/set-host-for-node";
import {setRootForNode} from "../../../host/root-for-node/set-root-for-node/set-root-for-node";
import {incrementUuid} from "../../../uuid/increment-uuid/increment-uuid";
import {setUuidForNode} from "../../../uuid/uuid-for-node/set-uuid-for-node/set-uuid-for-node";

/**
 * An abstract base class for generated instances of Templates
 */
export abstract class TemplateResultBase implements ITemplateResult {

	/**
	 * The previous ITemplateResult of this result
	 * @type {ITemplateResult|null}
	 */
	public previousSibling: ITemplateResult|null;

	/**
	 * The (last) stamped node, if any
	 * @type {Node|null}
	 */
	public lastNode: Node|null;

	/**
	 * The owner of this node
	 * @type {Node|null}
	 */
	public owner: Node;

	/**
	 * The host of this TemplateResultBase
	 * @type {IFoveaHost|ICustomAttribute}
	 */
	protected readonly host: IFoveaHost|ICustomAttribute;

	protected constructor ({host, previousSibling, owner}: ITemplateResultOptions) {
		this.host = host;
		this.owner = owner;
		this.previousSibling = previousSibling;
	}

	/**
	 * Disposes a TemplateResultBase
	 */
	public abstract dispose (): void;

	/**
	 * Destroys a TemplateResultBase (such that it can never be re-instantiated)
	 */
	public abstract destroy (): void;

	/**
	 * Upgrades the given host
	 * @param {IFoveaHost|ICustomAttribute} host
	 * @param {Node} node
	 * @param {ShadowRoot|Element} root
	 */
	public upgrade (host: IFoveaHost|ICustomAttribute, node: Node, root: ShadowRoot|Element): void {

		// Map the TextNode to it's host
		setHostForNode(node, host);

		// Map the node to its' root
		setRootForNode(node, root);

		// Generate and map a Uuid to the node
		setUuidForNode(node, incrementUuid());
	}

	/**
	 * Attaches a node to the DOM and updates its' pointers
	 * @param {Node} node
	 * @param {Node} owner
	 */
	protected attach (node: Node, owner: Node): void {

		if (this.previousSibling != null && this.previousSibling.lastNode != null && this.previousSibling.owner === this.owner) {
			owner.insertBefore(node, this.previousSibling.lastNode.nextSibling);
		}

		else {
			owner.appendChild(node);
		}
	}

	/**
	 * Detaches a node from the DOM and updates its' pointers
	 * @param {Node} node
	 */
	protected detach (node: Node): void {
		if (node.parentNode != null) {
			node.parentNode.removeChild(node);
		}
	}
}