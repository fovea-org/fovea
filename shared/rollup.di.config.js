import ts from "@wessberg/rollup-plugin-ts";
import {di} from "@wessberg/di-compiler";
import baseConfig from "./rollup.config";

export default {
	...baseConfig,
	plugins: [
		ts({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
			transformers: [
				di
			]
		})
	],
};