// tslint:disable:no-default-export
import {IFoveaCliConfig, IFoveaCliBundleOptimizationConfig, IFoveaCliServeConfig} from "@fovea/cli";
import {browsersWithoutSupportForFeatures, browsersWithSupportForFeatures, matchBrowserslistOnUserAgent} from "@wessberg/browserslist-generator";


// The serve configuration to use
const serve: IFoveaCliServeConfig = {
	host: "material.foveajs.test",
	port: 8000
};

// The optimization options to use
const optimization: Partial<IFoveaCliBundleOptimizationConfig> = {
	treeshake: {
		assignedTopLevelCallExpressionsHasNoSideEffects: true,
		readingPropertiesOfObjectsHasNoSideEffects: true,
		externalDependenciesHasNoSideEffects: true
	}
};


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
		"pointer-event",
		"requestanimationframe",
		"requestidlecallback"
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
			disable: false,
			serve,
			optimization
		},
		{
			tag: "modern",
			directory: "dist",
			browserslist: browsersWithSupportForFeatures("es6-class"),
			match: function (userAgent: string) {
				return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);
			},
			disable: "watch",
			serve,
			optimization
		},
		{
			tag: "legacy",
			directory: "dist",
			browserslist: browsersWithoutSupportForFeatures("es6-class"),
			match: function (userAgent: string) {
				return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);
			},
			disable: "watch",
			serve,
			optimization
		}
	]
};
