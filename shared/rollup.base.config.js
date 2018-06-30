import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import mainPackageJSON from "../package.json";

// noinspection NpmUsedModulesInstalled
import {builtinModules} from "module";

export default {
	treeshake: true,
	plugins: [
		typescriptRollupPlugin({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
			include: ["*.ts+(|x)", "**/*.ts+(|x)"],
			exclude: ["*.d.ts", "**/*.d.ts"],
			parseExternalModules: true
		})
	],
	external: [
		...(mainPackageJSON.dependencies == null ? [] : Object.keys(mainPackageJSON.dependencies)),
		...(mainPackageJSON.devDependencies == null ? [] : Object.keys(mainPackageJSON.devDependencies)),
		...builtinModules
	]
};