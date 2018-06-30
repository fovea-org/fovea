import {Expression} from "../expression/expression";
import Stringifier from "postcss/lib/stringifier";

/**
 * A Stringifier that is capable of stringifying Expressions
 */
export class FoveaStringifier extends Stringifier {
	/**
	 * Stringifies an Expression
	 * @param {Expression} node
	 */
	public expression (node: Expression) {
		const left = this.raw(node, "left");
		const right = this.raw(node, "right");
		if (node.source == null) {
			node.source = node.root().source;
		}
		this.builder(left + node.text + right, node);
	}
}