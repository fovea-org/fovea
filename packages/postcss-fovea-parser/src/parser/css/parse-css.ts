import Input from "postcss/lib/input";
import {Json} from "@fovea/common";
import {PostCSSFoveaCSSParser} from "./postcss-fovea-css-parser";
import {Root} from "postcss";

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