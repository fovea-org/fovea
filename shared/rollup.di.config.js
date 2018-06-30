import diPlugin from "@wessberg/rollup-plugin-di";
import baseConfig from "./rollup.config";

export default {
	...baseConfig,
	plugins: [
		diPlugin(),
		...baseConfig.plugins
	]
};