import {IFoveaCliConfig, IFoveaCliConfigMinusOutput, IFoveaCliOutputConfig} from "./i-fovea-cli-config";
import stringifyObject from "stringify-object";
import {NormalizeFunction} from "../normalize/normalize-function";
import deepExtend from "deep-extend";

// tslint:disable:no-magic-numbers
// tslint:disable:no-any

/**
 * A normalize function that retrieves a proper IFoveaCliConfig
 * @param {IBuildConfig} config
 * @param {Partial<IFoveaCliConfig>} options
 * @returns {Promise<IStringifiableConfig<IFoveaCliConfig>>}
 */
export const foveaCliConfigNormalizeFunction: NormalizeFunction<IFoveaCliConfig> = async ({config, options}) => {
	const configMinusOutputs: IFoveaCliConfigMinusOutput = {
		packageManager: "npm",
		polyfills: ["es", "custom-event", "web-components", "mutation-observer", "intersection-observer", "proxy", "class-list"],
		entry: `${config.srcFolderName}/${config.entryName}.${config.defaultScriptExtension}`,
		style: {
			directory: `${config.srcFolderName}/${config.stylesFolderName}`,
			theme: `${config.srcFolderName}/${config.stylesFolderName}/${config.themeStylesName}.${config.defaultCssExtension}`,
			global: `${config.srcFolderName}/${config.stylesFolderName}/${config.globalStylesName}.${config.defaultCssExtension}`
		},
		manifest: `${config.srcFolderName}/${config.manifestName}.${config.defaultJsonExtension}.${config.defaultScriptExtension}`,
		index: `${config.srcFolderName}/${config.indexName}.${config.defaultXMLScriptExtension}.${config.defaultScriptExtension}`,
		serviceWorker: `${config.srcFolderName}/${config.serviceWorkerFolderName}/${config.serviceWorkerName}.${config.defaultScriptExtension}`,
		tsconfig: `${config.tsconfigName}.json`,
		environment: {
			environment: `${config.srcFolderName}/${config.environmentFolderName}/${config.environmentFileName}.${config.defaultScriptExtension}`,
			environmentDefaults: `${config.srcFolderName}/${config.environmentFolderName}/${config.environmentDefaultsFileName}.${config.defaultScriptExtension}`
		},
		asset: {
			path: `${config.srcFolderName}/${config.assetFolderName}`,
			appIcon: {
				path: `${config.srcFolderName}/${config.assetFolderName}/${config.iconFolderName}/${config.appIconName}.${config.appIconExtension}`,
				sizes: [16, 32, 48, 96, 120, 128, 192, 256, 512]
			},
			optimization: {
				media: {
					progressive: true,
					quality: 0.8
				},
				skipOptimization: false
			}
		},
		exclude: []
	};

	return {
		config: {
			...deepExtend(configMinusOutputs, options),
			output: options.output != null ? options.output : <IFoveaCliOutputConfig[]> [
				{
					tag: "latest",
					directory: `${config.distFolderName}`,
					browserslist: <string[]><any>`browsersWithSupportForFeatures("es6-module", "shadowdomv1", "custom-elementsv1")`,
					match: <(userAgent: string) => boolean><any>`function (userAgent: string) {return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);}`,
					serve: {host: "localhost", port: 8000},
					disable: false
				},
				{
					tag: "modern",
					directory: `${config.distFolderName}`,
					browserslist: <string[]><any>`browsersWithSupportForFeatures("es6-class")`,
					match: <(userAgent: string) => boolean><any>`function (userAgent: string) {return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);}`,
					serve: {host: "localhost", port: 8000},
					disable: "watch"
				},
				{
					tag: "legacy",
					directory: `${config.distFolderName}`,
					browserslist: <string[]><any>`browsersWithoutSupportForFeatures("es6-class")`,
					match: <(userAgent: string) => boolean><any>`function (userAgent: string) {return matchBrowserslistOnUserAgent(userAgent, this.browserslist!);}`,
					serve: {host: "localhost", port: 8000},
					disable: "watch"
				}
			]
		},

		/**
		 * Stringifies the entire normalize function
		 * @returns {string}
		 */
		stringify () {
			return stringifyObject(this.config, {
				...config.stringifyObjectOptions, transform: (_val: {}, index: number|string, value: string) => {
					if (index === "browserslist" || index === "match") {
						// Remove the quotes surrounding the function call
						return value.slice(1, -1);
					}

					return value;
				}
			});
		}
	};
};