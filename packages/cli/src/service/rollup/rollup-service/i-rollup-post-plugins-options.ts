import {BabelOptions} from "../../../fovea-cli-config/i-fovea-cli-config";

export interface IRollupPostPluginsOptions {
	tsconfig?: string;
	browserslist?: string[];
	babel?: BabelOptions;
	root: string;
}