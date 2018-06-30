import {NodeUuid} from "../../node-uuid/node-uuid";
import {FoveaDOMAstNode} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface INodeDict<T extends FoveaDOMAstNode> {
	node: T;
	nodeUuid: NodeUuid;
}