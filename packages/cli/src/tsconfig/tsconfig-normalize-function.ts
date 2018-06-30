import {ModuleKind, ModuleResolutionKind, NewLineKind, ScriptTarget} from "typescript";
import stringifyObject from "stringify-object";
import {NormalizeFunction} from "../normalize/normalize-function";
import deepExtend from "deep-extend";
import {ITsconfig} from "./i-tsconfig";
import {IBuildConfig} from "../build-config/i-build-config";

/**
 * A normalize function that retrieves proper CompilerOptions for Typescript
 * @param {IBuildConfig} config
 * @param {Partial<ITsconfig>} options
 * @returns {Promise<IStringifiableConfig<ITsconfig>>}
 */
export const tsconfigNormalizeFunction: NormalizeFunction<ITsconfig> = async ({config, options}) => ({
	config: {
		...deepExtend(getDefaultTsconfigJsonData(config), options, getForcedTsconfigJsonData())
	},

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return stringifyObject(this.config, config.stringifyObjectOptions);
	}
});

/**
 * Retrieves the default options to use for the generated tsconfig.json file
 * @param {IBuildConfig} config
 * @returns {Partial<ITsconfig>}
 */
function getDefaultTsconfigJsonData (config: IBuildConfig) {
	return {
		exclude: [
			`${config.distFolderName}/**/*.*`
		],
		compilerOptions: {
			emitDecoratorMetadata: false,
			newLine: NewLineKind.LineFeed,
			sourceMap: true,
			allowSyntheticDefaultImports: true,
			strictNullChecks: true,
			noImplicitAny: true,
			noUnusedLocals: false,
			noUnusedParameters: false,
			noImplicitReturns: true,
			noImplicitThis: true,
			lib: [
				"ES5", "ES2015", "ES6", "ES7", "ES2016", "ES2017", "ESNext",
				"DOM", "DOM.iterable", "WebWorker", "ScriptHost"
			],
			baseUrl: ".",
			paths: {
				tslib: ["node_modules/tslib/tslib.d.ts"]
			}
		}
	};
}

/**
 * Retrieves the forced tsconfig.json options to use for the generated tsconfig.json file
 * @returns {Partial<ITsconfig>}
 */
function getForcedTsconfigJsonData () {
	return {
		compilerOptions: {
			alwaysStrict: true,
			importHelpers: true,
			experimentalDecorators: true,
			skipLibCheck: true,
			moduleResolution: ModuleResolutionKind.NodeJs,
			module: ModuleKind.ESNext,
			target: ScriptTarget.ESNext
		}
	};
}