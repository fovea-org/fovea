import {buildEnvironment} from "../build-environment/build-environment";
import {IBuildConfig} from "./i-build-config";
// @ts-ignore
import * as tempDir from "temp-dir";

// tslint:disable:no-magic-numbers

export const buildConfig: IBuildConfig = {
	get development () {
		return buildEnvironment.NODE_ENV == null || buildEnvironment.NODE_ENV === "" || buildEnvironment.NODE_ENV.toLowerCase() === "development";
	},
	get staging () {
		return buildEnvironment.NODE_ENV != null && buildEnvironment.NODE_ENV.toLowerCase() === "staging";
	},
	get production () {
		return buildEnvironment.NODE_ENV != null && buildEnvironment.NODE_ENV.toLowerCase() === "production";
	},
	get useSourcemaps () {
		return this.development;
	},
	testing: Boolean(buildEnvironment.TESTING),
	debug: Boolean(buildEnvironment.DEBUG),
	verbose: Boolean(buildEnvironment.VERBOSE),
	srcFolderName: "src",
	environmentFolderName: "environment",
	environmentFileName: "environment",
	environmentDefaultsFileName: "environment-defaults",
	defaultCssExtension: "scss",
	defaultScriptExtension: "ts",
	defaultDestinationScriptExtension: "js",
	defaultXMLScriptExtension: "html",
	defaultJsonExtension: "json",
	hashName: "hash",
	rootComponentName: "app",
	homeComponentName: "home",
	componentName: "component",
	assetFolderName: "asset",
	iconFolderName: "icon",
	appIconName: "app-icon",
	appIconExtension: "png",
	distFolderName: "dist",
	entryName: "main",
	indexName: "index",
	serviceWorkerFolderName: "serviceworker",
	serviceWorkerRegisterName: "register",
	serviceWorkerName: "serviceworker",
	serviceWorkerChunkPrefix: "sw.",
	serviceWorkerWorkboxName: "workbox",
	serviceWorkerWorkboxSWName: "workbox-sw",
	serviceWorkerCleanupName: "cleanup",
	serviceWorkerWorkboxInitializeName: "initialize-workbox",
	serviceWorkerRoutingName: "routing",
	serviceWorkerPrecachingName: "precaching",
	serviceWorkerRegisterFunctionName: "registerServiceWorker",
	manifestName: "manifest",
	stylesFolderName: "style",
	baseStylesName: "base",
	themeStylesName: "theme",
	colorStylesName: "color",
	fontStylesName: "font",
	sharedStylesName: "shared",
	globalStylesName: "global",
	foveaCliConfigName: "fovea-cli.config",
	tsconfigName: "tsconfig",
	tslintName: "tslint",
	gitignoreName: ".gitignore",
	npmignoreName: ".npmignore",
	defaultProjectVersion: "0.0.0",
	cacheRoot: tempDir,
	polyfillUrl: "https://polyfill.app/api/polyfill",
	formatOptions: {
		useTabs: true,
		semi: true,
		tabWidth: 2,
		singleQuote: false,
		trailingComma: "none",
		bracketSpacing: false,
		printWidth: 90,
		arrowParens: "avoid"
	},
	stringifyObjectOptions: {
		singleQuotes: true,
		inlineCharacterLimit: Infinity
	},
	styleOptions: {
		colorAlphaChannelSteps: 10
	},
	serveConfig: {
		cacheControl: {
			default: `public,max-age=31536000,immutable`,
			watch: `no-cache,max-age=31536000`
		},
		websocket: {
			liveReloadPath: "ws"
		}
	}
};