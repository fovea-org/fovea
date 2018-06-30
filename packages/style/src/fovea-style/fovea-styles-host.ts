import {IFoveaStylesHost} from "./i-fovea-styles-host";
import {IFoveaStylesOptions} from "./i-fovea-styles-options";
import {IFoveaStylesResult} from "./i-fovea-styles-result";
import {IPostCSS} from "../postcss/i-postcss";
import {postCSSFoveaPlugin} from "../postcss/postcss-fovea-plugin/postcss-fovea-plugin";
import {PostCSSFoveaCSSParserFunction, PostCSSFoveaSCSSParserFunction} from "@fovea/postcss-fovea-parser";
import {IFoveaStylesTakeVariablesResult} from "./i-fovea-styles-take-variables-result";
import {IFoveaStylesTakeVariablesOptions} from "./i-fovea-styles-take-variables-options";
import {postCSSTakeVariablesPlugin} from "../postcss/postcss-take-variables-plugin/postcss-take-variables-plugin";
// @ts-ignore
import postCSSImport from "postcss-import";
import {postCSSTakeVariablesPreparePlugin} from "../postcss/postcss-take-variables-prepare-plugin/postcss-take-variables-prepare-plugin";
import {IFoveaStylesTakeImportPathsOptions} from "./i-fovea-styles-take-import-paths-options";
import {IFoveaStylesTakeImportPathsResult} from "./i-fovea-styles-take-import-paths-result";
import {IFoveaStylesBaseOptions} from "./i-fovea-styles-base-options";
import {sassImportResolve} from "../postcss/sass-import-resolve/sass-import-resolve";

/**
 * FoveaStylesHost generates style instructions based on the given style contents.
 */
export class FoveaStylesHost implements IFoveaStylesHost {
	constructor (private readonly postCSS: IPostCSS,
							 private readonly postCSSFoveaCSSParserFunction: PostCSSFoveaCSSParserFunction,
							 private readonly postCSSFoveaSCSSParserFunction: PostCSSFoveaSCSSParserFunction) {
	}

	/**
	 * Generates style instructions based on the provided options
	 * @param {IFoveaStylesOptions} options
	 * @returns {Promise<IFoveaStylesResult>}
	 */
	public async generate ({file, template, postCSSPlugins, production, pluginConfigurationHook}: IFoveaStylesOptions): Promise<IFoveaStylesResult> {
		// Make sure we have an array to work with
		const normalizedPostCSSPlugins = postCSSPlugins == null ? [] : postCSSPlugins;

		// If the template is empty, return immediately
		if (template.length < 1) return {staticCSS: "", instanceCSS: ""};

		const baseOptions = {...this.preparePostCSSBaseOptions({template, file}), pluginConfigurationHook, production};

		// Run the file through PostCSS
		const {css: staticCSS} = await this.postCSS.process({...baseOptions, plugins: [...normalizedPostCSSPlugins, postCSSFoveaPlugin({mode: "static"})]});
		const {css: instanceCSS} = await this.postCSS.process({...baseOptions, plugins: [...normalizedPostCSSPlugins, postCSSFoveaPlugin({mode: "instance"})]});

		return {staticCSS, instanceCSS};
	}

	/**
	 * Takes all declared variables from the provided template
	 * @param {string} template
	 * @param {string} file
	 * @returns {Promise<IFoveaStylesTakeVariablesResult>}
	 */
	public async takeVariables ({template, file}: IFoveaStylesTakeVariablesOptions): Promise<IFoveaStylesTakeVariablesResult> {

		// If the template is empty, return immediately
		if (template.length < 1) return {};

		// Generate the import options for the PostCSS Import plugin
		const postCSSImportOptions = {
			resolve: (id: string, baseDir: string) => {
				const result = sassImportResolve(id, {cwd: baseDir});
				if (result == null) return null;
				return result.file;
			}
		};

		const baseOptions = this.preparePostCSSBaseOptions({template, file});

		// Start by running the file through PostCSS
		const {messages} = await this.postCSS.process({
			...baseOptions,
			prePlugins: [
				postCSSImport(postCSSImportOptions),
				postCSSTakeVariablesPreparePlugin({isScss: baseOptions.isScss})
			],
			plugins: [
				postCSSTakeVariablesPlugin()
			]
		});

		// Locate the message that comes from the postcss-take-variables-plugin and take the returned text
		const {text} = messages.find(message => message.plugin === postCSSTakeVariablesPlugin().postcssPlugin)!;

		// Parse it as JSON and return the result
		return JSON.parse(text!);
	}

	/**
	 * Takes all import paths from the matched CSS/SCSS
	 * @param {string} template
	 * @param {string} file
	 * @returns {Promise<IFoveaStylesTakeImportPathsResult>}
	 */
	public async takeImportPaths ({template, file}: IFoveaStylesTakeImportPathsOptions): Promise<IFoveaStylesTakeImportPathsResult> {
		const paths: Set<string> = new Set();

		// If the template is empty, return immediately
		if (template.length < 1) return {paths};

		// Generate the import options for the PostCSS Import plugin
		const postCSSImportOptions = {
			resolve: async (id: string, baseDir: string) => {
				const result = sassImportResolve(id, {cwd: baseDir});
				if (result == null) return null;

				paths.add(result.file);
				return result.file;
			}
		};

		// Start by running the file through PostCSS
		await this.postCSS.process({
			...this.preparePostCSSBaseOptions({template, file}),
			prePlugins: [
				postCSSImport(postCSSImportOptions)
			]
		});

		// Return all of the paths
		return {paths};
	}

	/**
	 * Prepares the base options to use for PostCSS
	 * @param {string} template
	 * @param {string} file
	 */
	private preparePostCSSBaseOptions ({template, file}: IFoveaStylesBaseOptions) {
		// If the file is a scss file
		const isScss = file.endsWith(".scss");

		// The shared options to use for both PostCSS steps
		return {
			production: false,
			template,
			file,
			isScss,
			parser: isScss
				// Use the SCSS parser for .scss files
				? this.postCSSFoveaSCSSParserFunction
				// Use the CSS parser for .css files
				: this.postCSSFoveaCSSParserFunction
		};
	}

}