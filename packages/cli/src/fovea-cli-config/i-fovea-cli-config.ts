import {IBabelMinifyOptions} from "../service/minify/i-babel-minify-options";
import {ICompressionAlgorithmOptions} from "../service/compression/compression-algorithm-options";
import {OutputOptions} from "rollup";
import {IBabelInputOptions, TypescriptPluginOptions} from "@wessberg/rollup-plugin-ts";

export type PostCSSPlugin = import("postcss").Plugin<{}>;

export interface IFoveaCliBundleOptimizationConfig {
	// Whether or not to print comments, or a callback that will be invoked with each one and return true if it should be preserved
	comments: boolean|((value: string) => boolean);

	// Whether or not to minify builds, or optionally an object of configuration options
	minify: boolean|IBabelMinifyOptions;

	// Whether or not to compress builds, or optionally an object of configuration options
	compress: boolean|ICompressionAlgorithmOptions;

	// Treeshaking options
	treeshake: boolean|Partial<{
		assignedTopLevelCallExpressionsHasNoSideEffects: boolean;
		readingPropertiesOfObjectsHasNoSideEffects: boolean;
		externalDependenciesHasNoSideEffects: boolean;
	}>;
}

export interface IFoveaCliOutputConfig {
	tag: string;
	directory: string;
	serve: IFoveaCliServeConfig;
	postcss?: Partial<{
		plugins: PostCSSPlugin[];
	}>;
	babel?: Pick<IBabelInputOptions, "plugins"|"presets">;
	browserslist?: TypescriptPluginOptions["browserslist"];
	disable: boolean|"watch";
	optimization?: Partial<IFoveaCliBundleOptimizationConfig>;
	// Whether or not to generate sourcemaps, or optionally "inline" if a sourcemap should be appended to the generated files
	sourcemap?: OutputOptions["sourcemap"];
	// A string to prepend to the bundle.
	banner?: OutputOptions["banner"];
	// A string to append to the bundle.
	footer?: OutputOptions["footer"];
	// A string to prepend to the bundle. Like banner, but will go inside any module wrapper that may be.
	intro?: OutputOptions["intro"];
	// A string to append to the bundle. Like banner, but will go inside any module wrapper that may be.
	outro?: OutputOptions["outro"];
	match (userAgent: string): boolean;
}

export interface IFoveaCliOutputConfigNormalized extends IFoveaCliOutputConfig {
	browserslist: string[]|false;
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
	exclude: Iterable<RegExp>|RegExp;
	entry: string;
	style: IFoveaCliStyleConfig;
	manifest: string;
	index: string;
	serviceWorker: string;
	tsconfig: TypescriptPluginOptions["tsconfig"];
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