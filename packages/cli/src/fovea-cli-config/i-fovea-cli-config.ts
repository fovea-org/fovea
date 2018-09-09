import {Plugin} from "postcss";

export interface IFoveaCliOutputConfig {
	tag: string;
	directory: string;
	serve: IFoveaCliServeConfig;
	postCSSPlugins?: Plugin<{}>[];
	browserslist?: string[];
	match (userAgent: string): boolean;
	disable: boolean|"watch";
}

export declare type FoveaCliOutputConfigs = IFoveaCliOutputConfig[]|IFoveaCliOutputConfig;

export interface IFoveaCliServeConfig {
	port: number;
	host: string;
}

export interface IFoveaCliEnvironmentConfig {
	environmentDefaults: string;
	environment: string;
}

export interface IFoveaCliAssetOptimizationConfig {
	media: IFoveaCliAssetOptimizationMediaConfig;
	skipOptimization: boolean;
}

export interface IFoveaCliAssetOptimizationMediaConfig {
	maxSize?: Partial<{ width: number; height: number }>;
	progressive: boolean;
	quality: number;
}

export interface IFoveaCliAssetAppIconConfig {
	path: string;
	sizes: number[];
}

export interface ICustomPath {
	input: string;
	output: string;
}

export declare type CustomPath = string|ICustomPath;

export interface IFoveaCliAssetConfig {
	path: string;
	// paths: CustomPath[];
	appIcon: IFoveaCliAssetAppIconConfig;
	optimization: IFoveaCliAssetOptimizationConfig;
}

export interface IFoveaCliStyleConfig {
	directory: string;
	theme: string;
	global: string;
}

export interface IFoveaCliConfigMinusOutput {
	exclude: Iterable<RegExp> | RegExp;
	entry: string;
	style: IFoveaCliStyleConfig;
	manifest: string;
	index: string;
	serviceWorker: string;
	tsconfig: string;
	environment: IFoveaCliEnvironmentConfig;
	asset: IFoveaCliAssetConfig;
	packageManager: "yarn"|"npm";
	polyfills: string[];
}

export interface IFoveaCliConfig extends IFoveaCliConfigMinusOutput {
	output: FoveaCliOutputConfigs;
}

export interface IFoveaCliConfigWithAppName extends IFoveaCliConfig {
	output: FoveaCliOutputConfigs;
	appName: string;
}