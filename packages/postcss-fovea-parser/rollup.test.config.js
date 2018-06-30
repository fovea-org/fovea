import {FORMAT_NODE} from "../../shared/shared-package.json.js";
import baseConfig from "./rollup.base.config";

export default {
	...baseConfig,
	input: "test/postcss-fovea-parser/postcss-fovea-parser.test.ts",
	output: {
		file: "compiled/postcss-fovea-parser.test.js",
		format: FORMAT_NODE,
		sourcemap: true
	}
};