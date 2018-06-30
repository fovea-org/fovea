import * as Node from "postcss/lib/node";
import {Json} from "@fovea/common";
import * as Stringifier from "postcss/lib/stringifier";

/**
 * Extend the PostCSS Stringifier with the possibility of stringifying Expressions
 * @param {Expression} node
 */
Stringifier.prototype.expression = function (node: Expression) {
	const left = this.raw(node, "left");
	const right = this.raw(node, "right");
	if (node.source == null) {
		node.source = node.root().source;
	}
	this.builder(left + node.text + right, node);
};

/**
 * An Expression is a block in which live expression live
 */
export class Expression extends Node {

	constructor (defaults?: Json) {
		// @ts-ignore
		super(defaults);
		this.type = "expression";
	}
}