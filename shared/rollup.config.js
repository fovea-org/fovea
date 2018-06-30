import baseConfig from "./rollup.base.config";
import sharedPackageJSON, {FORMAT_MODULE, FORMAT_NODE} from "./shared-package.json.js";

export default {
	...baseConfig,
	input: "src/index.ts",
	output: [
		{
			file: sharedPackageJSON.main,
			format: FORMAT_NODE,
			sourcemap: true
		},
		{
			file: sharedPackageJSON.module,
			format: FORMAT_MODULE,
			sourcemap: true
		}
	]
};