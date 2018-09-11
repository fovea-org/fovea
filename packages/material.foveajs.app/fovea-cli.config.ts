// tslint:disable:no-default-export
import {IFoveaCliConfig} from "@fovea/cli";
import {browsersWithoutSupportForFeatures, browsersWithSupportForFeatures, matchBrowserslistOnUserAgent} from "@wessberg/browserslist-generator";

// The host name to serve from
const host = "material.foveajs.test";
// The port to serve on
const port = 8000;


/**
 * This is the configuration for the Fovea CLI. These options will be used by the underlying build tools
 */
export default <Partial<IFoveaCliConfig>>{
	packageManager: "npm",
	polyfills: [
		"es",
		"custom-event",
		"web-components",
		"mutation-observer",
		"intersection-observer",
		"proxy",
		"pointer-event"
	],
	entry: "src/main.ts",
	style: {
		directory: "src/style",
		theme: "src/style/theme.scss",
		global: "src/style/global.scss"
	},
	manifest: "src/manifest.json.ts",
	index: "src/index.html.ts",
	serviceWorker: "src/serviceworker/serviceworker.ts",
	tsconfig: "tsconfig.json",
	environment: {
		environment: "src/environment/environment.ts",
		environmentDefaults: "src/environment/environment-defaults.ts"
	},
	asset: {
		path: "src/asset",
		appIcon: {
			path: "src/asset/icon/app-icon.png",
			sizes: [16, 32, 48, 96, 120, 128, 192, 256, 512]
		},
		optimization: {media: {progressive: true, quality: 0.8}, skipOptimization: false}
	},
	exclude: [],
	output: [
		{
			tag: "latest",
			directory: "dist",
			browserslist: browsersWithSupportForFeatures(
				"es6-module",
				"es6-module-dynamic-import",
				"shadowdomv1",
				"custom-elementsv1"
			),
			match: function (userAgent: string) {
				return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);
			},
			serve: {host, port},
			disable: false
		},
		{
			tag: "modern",
			directory: "dist",
			browserslist: browsersWithSupportForFeatures("es6-class"),
			match: function (userAgent: string) {
				return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);
			},
			serve: {host, port},
			disable: "watch"
		},
		{
			tag: "legacy",
			directory: "dist",
			browserslist: browsersWithoutSupportForFeatures("es6-class"),
			match: function (userAgent: string) {
				return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);
			},
			serve: {host, port},
			disable: "watch"
		}
	]
};
