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
		include: [
			`${config.srcFolderName}/**/*.*`
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
				"es5",
				"es2015",
				"es2016",
				"es2017",
				"esnext",
				"dom",
				"dom.iterable",
				"webworker",
				"webworker.importscripts"
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