import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import diPlugin from "@wessberg/rollup-plugin-di";
import mainPackageJSON from "../package.json";

// noinspection NpmUsedModulesInstalled
import {builtinModules} from "module";

export default {
	treeshake: true,
	plugins: [
		diPlugin(),
		typescriptRollupPlugin({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
			include: ["*.ts+(|x)", "**/*.ts+(|x)"],
			exclude: ["*.d.ts", "**/*.d.ts"],
			parseExternalModules: true
		})
	],
	external: [
		...Object.keys(mainPackageJSON.dependencies),
		...Object.keys(mainPackageJSON.devDependencies),
		...builtinModules
	]
};