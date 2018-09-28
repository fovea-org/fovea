import {FirstArgumentType} from "../../cache-registry/i-cache-registry-get-result";

export interface IRollupPostPluginsOptions {
	tsconfig?: string;
	browserslist?: string[];
	babel?: Exclude<FirstArgumentType<typeof import("@wessberg/rollup-plugin-ts").default>, undefined>["babel"];
	root: string;
}