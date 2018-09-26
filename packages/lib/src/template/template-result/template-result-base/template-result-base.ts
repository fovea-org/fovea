import {ITemplateResult} from "../template-result/i-template-result";
import {FoveaHost, INodeExtension} from "@fovea/common";
import {ITemplateResultOptions} from "../template-result/i-template-result-options";
import {incrementUuid} from "../../../uuid/increment-uuid/increment-uuid";

// tslint:disable:no-any

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
	 * @type {FoveaHost}
	 */
	protected readonly host: FoveaHost;

	/**
	 * The root of this TemplateResultBase
	 * @type {Element|ShadowRoot}
	 */
	protected readonly root: Element|ShadowRoot;

	/**
	 * Whether or not the TemplateConditionalElement has been destroyed
	 * @type {boolean}
	 */
	protected destroyed: boolean = false;

	/**
	 * Whether or not the TemplateConditionalElement has been disposed
	 * @type {boolean}
	 */
	protected disposed: boolean = false;

	protected constructor ({host, previousSibling, owner, root}: ITemplateResultOptions) {
		this.host = host;
		this.owner = owner;
		this.previousSibling = previousSibling;
		this.root = root;
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
	 * @param {Node} node
	 * @param {ShadowRoot|Element} root
	 */
	public upgrade (node: Node&Partial<INodeExtension>, root: ShadowRoot|Element): void {
		node.___root = root;
		node.___uuid = incrementUuid();
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