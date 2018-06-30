import {FORMAT_NODE} from "../../shared/shared-package.json.js";
import baseConfig from "./rollup.base.config";

export default {
	...baseConfig,
	input: "test/fovea-compiler/fovea-compiler.test.ts",
	output: {
		file: "compiled/fovea-compiler.test.js",
		format: FORMAT_NODE,
		sourcemap: true
	}
};