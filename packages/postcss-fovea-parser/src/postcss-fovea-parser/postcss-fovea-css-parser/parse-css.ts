import * as Input from "postcss/lib/input";
import {Json} from "@fovea/common";
import {PostCSSFoveaCSSParser} from "./postcss-fovea-css-parser";
import {Root} from "postcss";
import * as Container from "postcss/lib/container";
import * as Declaration from "postcss/lib/declaration";

/**
 * Parses the given css with the given options
 * @param {string} css
 * @param {Json} opts
 * @returns {Root}
 */
export function postCSSFoveaCSSParser (css: string, opts: Json): Root {
	const input = new Input(css, opts);

	const parser = new (<Json>PostCSSFoveaCSSParser)(input);
	parser.parse();

	return parser.root;
}

/**
 * This is by no means pretty, but postcss hard-codes a require() call to its local ./parse function within the Container class. We have to manually overwrite it here
 * @param {Json[]} nodes
 * @param {Json} sample
 * @returns {(Json | undefined)[]}
 */
Container.prototype.normalize = function (nodes: Json[], sample: Json) {
// tslint:disable
	function cleanSource (sourceNodes: Node[]) {
		return sourceNodes.map(node => {
			const i = <Root><Json>node;
			if (i.nodes != null) i.nodes = <Json> cleanSource(<Json>i.nodes);
			delete i.source;
			return i;
		});
	}

	if (typeof nodes === "string") {
		const parse = postCSSFoveaCSSParser;
		nodes = <Json>cleanSource(<Json>parse(nodes, {}).nodes!);
	} else if (Array.isArray(nodes)) {
		nodes = nodes.slice(0);
		for (const i of nodes) {
			if ((<Json>i).parent) (<Json>i).parent.removeChild(i, "ignore");
		}
	} else if ((<Json>nodes).type === "root") {
		nodes = (<Json>nodes).nodes.slice(0);
		for (const i of nodes) {
			if ((<Json>i).parent) (<Json>i).parent.removeChild(i, "ignore");
		}
	} else if ((<Json>nodes).type) {
		nodes = [nodes];
	} else if ((<Json>nodes).prop) {
		if (typeof (<Json>nodes).value === "undefined") {
			throw new Error("Value field is missed in node creation");
		} else if (typeof (<Json>nodes).value !== "string") {
			(<Json>nodes).value = String((<Json>nodes).value);
		}
		nodes = [new Declaration(nodes)];
	} else if ((<Json>nodes).selector) {
		const Rule = require("./rule");
		nodes = [new Rule(nodes)];
	} else if ((<Json>nodes).name) {
		const AtRule = require("./at-rule");
		nodes = [new AtRule(nodes)];
	} else if ((<Json>nodes).text) {
		nodes = [(<Json>new Comment)(nodes)];
	} else {
		throw new Error("Unknown node type in node creation");
	}

	const processed = nodes.map(i => {
		if (typeof (<Json>i).before !== "function") i = this.rebuild(i);

		if ((<Json>i).parent) (<Json>i).parent.removeChild(i);
		if (typeof (<Json>i).raws.before === "undefined") {
			if (sample && typeof sample.raws.before !== "undefined") {
				(<Json>i).raws.before = sample.raws.before.replace(/[^\s]/g, "");
			}
		}
		(<Json>i).parent = this;
		return i;
	});

	return processed;
};