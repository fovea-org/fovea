import {FORMAT_NODE} from "../../shared/shared-package.json.js";
import baseConfig from "./rollup.base.config";

export default {
	...baseConfig,
	input: "test/fovea-style/fovea-style.test.ts",
	output: {
		file: "compiled/fovea-style.test.js",
		format: FORMAT_NODE,
		sourcemap: true
	}
};