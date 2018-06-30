import baseConfig from "../../shared/rollup.config";
import packageJSON from "./package.json";

export default {
	...baseConfig,
	external: [
		...baseConfig.external,
		...(packageJSON.dependencies == null ? [] : Object.keys(packageJSON.dependencies)),
		...(packageJSON.devDependencies == null ? [] : Object.keys(packageJSON.devDependencies)),
		"postcss/lib/stringifier",
		"postcss/lib/node",
		"postcss/lib/input",
		"postcss/lib/parser",
		"postcss/lib/container",
		"postcss/lib/declaration",
		"postcss-scss/lib/scss-parser",
		"@fovea/common"
	]
};