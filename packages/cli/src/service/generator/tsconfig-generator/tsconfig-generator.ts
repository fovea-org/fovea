import {ITsconfigGenerator} from "./i-tsconfig-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {ITsconfigGeneratorOptions} from "./i-tsconfig-generator-options";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IFormatter} from "../../../formatter/i-formatter";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {ITsconfig} from "../../../tsconfig/i-tsconfig";
import {JsxEmit, ModuleKind, ModuleResolutionKind, NewLineKind, ScriptTarget} from "typescript";

/**
 * A class that helps with generating a tsconfig.json file
 */
export class TsconfigGenerator extends Generator implements ITsconfigGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter,
							 private readonly normalizeFunction: NormalizeFunction<ITsconfig>) {
		super();
	}

	/**
	 * Generates tsconfig.json data based on the given options
	 * @param {Partial<ITsconfig>} options
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: ITsconfigGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: this.config});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: this.config.tsconfigName,
				extension: "json",
				content: this.formatter.format(
					JSON.stringify(this.prepareConfigForStringifying(merged.config)),
					{...this.config.formatOptions, parser: "json"}
				)
			}
		];
	}

	/**
	 * Prepares an ITsconfig for stringifying
	 * @param {ITsconfig} config
	 * @returns {object}
	 */
	private prepareConfigForStringifying (config: ITsconfig): object {
		return {
			...config,
			compilerOptions: {
				...config.compilerOptions,
				...(config.compilerOptions.jsx == null ? {} : (() => {
					switch (config.compilerOptions.jsx) {
						case JsxEmit.None:
							return {};
						case JsxEmit.Preserve:
							return {jsx: "preserve"};
						case JsxEmit.React:
							return {jsx: "react"};
						case JsxEmit.ReactNative:
							return {jsx: "react-native"};
					}
				})()),
				...(config.compilerOptions.module == null ? {} : (() => {
					switch (config.compilerOptions.module) {
						case ModuleKind.None:
							return {module: "none"};
						case ModuleKind.UMD:
							return {module: "umd"};
						case ModuleKind.ESNext:
							return {module: "esnext"};
						case ModuleKind.System:
							return {module: "system"};
						case ModuleKind.CommonJS:
							return {module: "commonjs"};
						case ModuleKind.AMD:
							return {module: "amd"};
						case ModuleKind.ES2015:
							return {module: "es2015"};
					}
				})()),
				...(config.compilerOptions.moduleResolution == null ? {} : (() => {
					switch (config.compilerOptions.moduleResolution) {
						case ModuleResolutionKind.Classic:
							return {moduleResolution: "classic"};
						case ModuleResolutionKind.NodeJs:
							return {moduleResolution: "node"};
					}
				})()),
				...(config.compilerOptions.newLine == null ? {} : (() => {
					switch (config.compilerOptions.newLine) {
						case NewLineKind.LineFeed:
							return {newLine: "LF"};
						case NewLineKind.CarriageReturnLineFeed:
							return {newLine: "CRLF"};
					}
				})()),
				...(config.compilerOptions.target == null ? {} : (() => {
					switch (config.compilerOptions.target) {
						case ScriptTarget.ESNext:
							return {target: "esnext"};
						case ScriptTarget.Latest:
							return {target: "latest"};
						case ScriptTarget.ES5:
							return {target: "es5"};
						case ScriptTarget.ES2015:
							return {target: "es2015"};
						case ScriptTarget.ES3:
							return {target: "es3"};
						case ScriptTarget.ES2016:
							return {target: "es2016"};
						case ScriptTarget.ES2017:
							return {target: "es2017"};
						case ScriptTarget.ES2018:
							return {target: "es2018"};
						case ScriptTarget.JSON:
							return {target: "json"};
					}
				})())
			}
		};
	}
}