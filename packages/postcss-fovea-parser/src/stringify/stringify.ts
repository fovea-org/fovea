import {FoveaStringifier} from "../stringifier/stringifier";
import {Json} from "@fovea/common";
import {Node} from "postcss";

// tslint:disable:no-any

/**
 * A stringifier that is capable of parsing Fovea-enhanced CSS/SCSS
 * @param {Node} node
 * @param builder
 */
export function foveaStringify (node: Node, builder: any) {
	const str = new (<Json>FoveaStringifier)(builder);
	str.stringify(node);
}