import baseConfig from "./rollup.config";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import minify from "rollup-plugin-babel-minify";
import {FORMAT_FLAT_MODULE, FORMAT_IMMEDIATELY_INVOKED_FUNCTION, FORMAT_MODULE, formatOutputPath} from "./shared-package.json.js";

const browserConfig = {
	...baseConfig,
	plugins: [
		commonjs(),
		nodeResolve(),
		...baseConfig.plugins,
		...(process.env.NODE_ENV !== "production" ? [] : [
			minify({
				comments: false
			})
		])
	]
};

export default (name) => [
	{
		isFlat: false,
		config: {
			...browserConfig,
			external: [
				...browserConfig.external,
				"@fovea/lib"
			]
		}
	},
	{
		isFlat: true,
		config: {
			...browserConfig,
			output: [
				{
					file: formatOutputPath(FORMAT_FLAT_MODULE),
					format: FORMAT_MODULE,
					sourcemap: true
				},
				{
					file: formatOutputPath(FORMAT_IMMEDIATELY_INVOKED_FUNCTION),
					format: FORMAT_IMMEDIATELY_INVOKED_FUNCTION,
					name,
					sourcemap: true
				}
			],
			external: [
				...browserConfig.external
			]
		}
	}
];