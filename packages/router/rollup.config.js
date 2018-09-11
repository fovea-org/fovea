import baseConfigs from "../../shared/rollup.browser.config";
import foveaRollupPlugin from "@fovea/rollup-plugin-fovea";
import packageJSON from "./package.json";

export default [
	...baseConfigs("FoveaRouter")
		.map(({config, isFlat}) => ({
			...config,
			external: isFlat ? [] : [
				...config.external,
				...(packageJSON.dependencies == null ? [] : Object.keys(packageJSON.dependencies)),
				...(packageJSON.devDependencies == null ? [] : Object.keys(packageJSON.devDependencies))
			],
			plugins: [
				foveaRollupPlugin(),
				...config.plugins
			]
		}))
];