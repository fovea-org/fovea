import Node from "postcss/lib/node";
import {Json} from "@fovea/common";

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