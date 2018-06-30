import baseConfig from "../../shared/rollup.di.config";
import packageJSON from "./package.json";

export default {
	...baseConfig,
	external: [
		...baseConfig.external,
		...(packageJSON.dependencies == null ? [] : Object.keys(packageJSON.dependencies)),
		...(packageJSON.devDependencies == null ? [] : Object.keys(packageJSON.devDependencies))
	]
};