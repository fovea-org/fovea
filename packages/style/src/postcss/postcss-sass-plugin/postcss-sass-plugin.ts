// tooling
import postcss, {ResultOptions, TransformCallback} from "postcss";
import sass, {ImporterReturnType, Result, SassError} from "node-sass";
import {dirname, resolve as pathResolve} from "path";
import {IPostCSSSassPluginOptions} from "./i-postcss-sass-plugin-options";
import {Json} from "@fovea/common";
import {sassImportResolve} from "../sass-import-resolve/sass-import-resolve";
import {ISassImportResolveResult} from "../sass-import-resolve/i-sass-import-resolve-result";

/**
 * A PostCSS plugin that can transform Sass
 * @type {Plugin<Partial<IPostCSSSassPluginOptions>>}
 */
export const postCSSSassPlugin = postcss.plugin("postcss-sass", (opts?: Partial<IPostCSSSassPluginOptions>): TransformCallback => async (root, result) => {
	if (result == null) throw new ReferenceError(`Error: The result must be given!`);

	// Define a configuration for PostCSS
	const postCSSConfig: ResultOptions = {
		...result.opts,
		...requiredPostCSSConfig
	};

	// postcss results
	const {css: postCSS} = root.toResult(postCSSConfig);

	/**
	 * The paths to include
	 * @type {string[]}
	 */
	const includePaths: string[] = opts == null || opts.includePaths == null ? [] : opts.includePaths;

	/**
	 * Transforms the given file and contents
	 * @param file
	 * @param contents
	 */
	const transform = (file: string, contents: string|undefined): string|null|void|undefined => {
		// If a 'transform' hook is given, invoke it with the file and its' contents
		if (opts != null && opts.transform != null) {
			return opts.transform(file, contents == null ? "" : contents);
		}
		return undefined;
	};

	const sassOptions = {
		...opts,
		...requiredSassConfig,
		file: `${postCSSConfig.from}#sass`,
		outFile: postCSSConfig.from,
		data: postCSS,
		importer (id: string, parentId: string, done: (data: ImporterReturnType) => void) {
			// resolve the absolute parent
			const parent = pathResolve(parentId);

			// cwds is the list of all directories to search
			const cwds: string[] = [dirname(parent)]
				.concat(includePaths)
				.map(includePath => pathResolve(includePath));

			let resolved: ISassImportResolveResult|undefined;
			let importerError: Error|null = null;

			// Resolve the path
			for (let i = 0; i < cwds.length; i++) {
				const cwd = cwds[i];
				const isLast = i === cwds.length - 1;

				try {
					resolved = sassImportResolve(id, {cwd, readFile: true});
					break;
				}
				catch (ex) {
					if (isLast) {
						importerError = ex;
					}
				}
			}

			if (importerError != null) {
				done(importerError);
			}

			else if (resolved != null) {
				// push the dependency to watch tasks
				result.messages.push(<Json>{type: "dependency", file: resolved.file, parent});

				// Transform the given file
				const dependencyTransformResult = transform(resolved.file, resolved.contents);
				// If something was returned, update the contents
				if (dependencyTransformResult != null) {
					resolved.contents = dependencyTransformResult;
				}

				// Pass the file and contents back to sass
				done(resolved);
			}
		}
	};

	const {css: sassCSS, stats} = await new Promise<Result>((resolve, reject) => sass.render(<Json>sassOptions, (sassError: SassError, sassResult: Result) => {
		if (sassError != null) return reject(sassError);
		return resolve(sassResult);
	}));

	let stringified = sassCSS.toString();
	const normalizedEntry = stats.entry.endsWith("#sass") ? stats.entry.slice(0, stats.entry.lastIndexOf("#sass")) : stats.entry;

	// Transform the content before passing it on to sass
	const transformResult = transform(normalizedEntry, stringified);
	if (transformResult != null) stringified = transformResult;

	// update root to post-node-sass ast
	result.root = postcss.parse(stringified, <Json>postCSSConfig);
});

const requiredPostCSSConfig: ResultOptions = {
	map: {
		annotation: false,
		inline: false,
		sourcesContent: true
	}
};

const requiredSassConfig = {
	omitSourceMapUrl: true,
	sourceMap: false,
	sourceMapContents: true
};