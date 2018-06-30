import baseConfig from "../../shared/rollup.config";
import packageJSON from "./package.json";

export default {
	...baseConfig,
	external: [
		...baseConfig.external,
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies),
		"@fovea/lib"
	]
};