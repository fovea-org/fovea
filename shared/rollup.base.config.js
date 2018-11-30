import ts from "@wessberg/rollup-plugin-ts";
import mainPackageJSON from "../package.json";

// noinspection NpmUsedModulesInstalled
import {builtinModules} from "module";

export default {
	treeshake: true,
	plugins: [
		ts({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json"
		})
	],
	external: [
		...(mainPackageJSON.dependencies == null ? [] : Object.keys(mainPackageJSON.dependencies)),
		...(mainPackageJSON.devDependencies == null ? [] : Object.keys(mainPackageJSON.devDependencies)),
		...builtinModules
	]
};