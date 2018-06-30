import Input from "postcss/lib/input";
import {Json} from "@fovea/common";
import {PostCSSFoveaSCSSParser} from "./postcss-fovea-scss-parser";
import {Root} from "postcss";

/**
 * Parses the given scss with the given options
 * @param {string} scss
 * @param {Json} opts
 * @returns {Root}
 */
export function postCSSFoveaSCSSParser (scss: string, opts: Json): Root {
	const input = new Input(scss, opts);

	const parser = new (<Json>PostCSSFoveaSCSSParser)(input);
	parser.parse();

	return parser.root;
}