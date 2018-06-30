import {FORMAT_NODE} from "../../shared/shared-package.json.js";
import baseConfig from "./rollup.base.config";

export default {
	...baseConfig,
	input: "test/fovea-dom/fovea-dom.test.ts",
	output: {
		file: "compiled/fovea-dom.test.js",
		format: FORMAT_NODE,
		sourcemap: true
	}
};