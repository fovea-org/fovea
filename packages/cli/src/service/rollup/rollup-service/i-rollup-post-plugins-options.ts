export interface IRollupPostPluginsOptions {
	tsconfig?: string;
	browserslist?: string[];
	additionalBabelPlugins?: {}[];
	additionalBabelPresets?: {}[];
	root: string;
}