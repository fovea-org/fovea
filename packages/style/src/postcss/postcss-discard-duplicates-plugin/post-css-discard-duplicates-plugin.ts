import postcss, {Node, Root} from "postcss";
import {Json} from "@fovea/common";

// tslint:disable

/**
 * THIS IS A CUSTOMIZED VERSION OF {@link https://github.com/ben-eb/postcss-discard-duplicates}
 * WHICH IS UNMAINTAINED AT THE MOMENT
 */

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-discard-duplicates-plugin";

/**
 * A Plugin that can discard duplicates within CSS
 * @type {postcss.Plugin<{}>}
 */
export const postCSSDiscardDuplicatesPlugin = postcss.plugin(name, () => dedupe);

function noop () {
}

function trimValue (value: string) {
	return value ? value.trim() : value;
}

function empty (node: Root) {
	return !node.nodes!
		.filter(child => child.type !== "comment")
		.length;
}

function equals (a: Json, b: Json) {
	if (a.type !== b.type) {
		return false;
	}

	if (a.important !== b.important) {
		return false;
	}

	if ((a.raws && !b.raws) || (!a.raws && b.raws)) {
		return false;
	}

	switch (a.type) {
		case "rule":
			if (a.selector !== b.selector) {
				return false;
			}
			break;
		case "atrule":
			if (a.name !== b.name || a.params !== b.params) {
				return false;
			}

			if (a.raws && trimValue(a.raws.before) !== trimValue(b.raws.before)) {
				return false;
			}

			if (a.raws && trimValue(a.raws.afterName) !== trimValue(b.raws.afterName)) {
				return false;
			}
			break;
		case "decl":
			if (a.prop !== b.prop || a.value !== b.value) {
				return false;
			}

			if (a.raws && trimValue(a.raws.before) !== trimValue(b.raws.before)) {
				return false;
			}
			break;
	}

	if (a.nodes) {
		if (a.nodes.length !== b.nodes.length) {
			return false;
		}

		for (let i = 0; i < a.nodes.length; i++) {
			if (!equals(a.nodes[i], b.nodes[i])) {
				return false;
			}
		}
	}
	return true;
}

function dedupeRule (last: Json, nodes: Json[]) {
	let index = nodes.indexOf(last) - 1;
	while (index >= 0) {
		const node = nodes[index--];
		if (
			node &&
			node.type === "rule" &&
			node.selector === last.selector
		) {
			last.each((child: Node) => {
				if (child.type === "decl") {
					dedupeNode(child, node.nodes);
				}
			});

			if (empty(node)) {
				node.remove();
			}
		}
	}
}

function dedupeNode (last: Json, nodes: Json[]) {
	let index = !!~nodes.indexOf(last)
		? nodes.indexOf(last) - 1
		: nodes.length - 1;

	while (index >= 0) {
		const node = nodes[index--];
		if (node && equals(node, last)) {
			node.remove();
		}
	}
}

const handlers: { [key: string]: Function } = {
	rule: dedupeRule,
	atrule: dedupeNode,
	decl: dedupeNode,
	comment: noop
};

function dedupe (root: Json) {
	let nodes = root.nodes;

	if (!nodes) {
		return;
	}

	let index = nodes.length - 1;
	while (index >= 0) {
		let last = nodes[index--];
		if (!last || !last.parent) {
			continue;
		}
		dedupe(last);

		if (last.type in handlers) {
			handlers[last.type](last, nodes);
		}
	}
}