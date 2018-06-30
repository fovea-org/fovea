import baseConfig from "../../shared/rollup.config";
import foveaRollupPlugin from "@fovea/rollup-plugin-fovea";
import packageJSON from "./package.json";

export default {
	...baseConfig,
	external: [
		...baseConfig.external,
		...(packageJSON.dependencies == null ? [] : Object.keys(packageJSON.dependencies)),
		...(packageJSON.devDependencies == null ? [] : Object.keys(packageJSON.devDependencies)),
		"@fovea/lib"
	],
	plugins: [
		foveaRollupPlugin(),
		...baseConfig.plugins
	]
};