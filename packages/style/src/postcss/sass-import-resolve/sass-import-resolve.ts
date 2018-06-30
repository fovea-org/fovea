import {readFileSync, statSync} from "fs";
import {basename, dirname, join} from "path";
import {ISassImportResolveOptions} from "./i-sass-import-resolve-options";
import {ISassImportResolveResult} from "./i-sass-import-resolve-result";

// sass resolve cache
const cache: { [key: string]: ISassImportResolveResult|false } = {};

/**
 * Helps with resolving the absolute path of a Sass file
 * @param {string} id
 * @param {Partial<ISassImportResolveOptions>} rawOptions
 * @returns {ISassImportResolveResult|undefined}
 */
export function sassImportResolve (id: string, rawOptions: Partial<ISassImportResolveOptions>): ISassImportResolveResult|undefined {
	const options: ISassImportResolveOptions = {
		cwd: process.cwd(),
		readFile: false,
		...rawOptions
	};

	// if `id` starts with `/`
	if (startsWithRoot(id)) {
		// `cwd` is the filesystem root
		options.cwd = "";
	}

	// `file` is `cwd/id`
	const file = join(options.cwd, id);

	// `base` is the last segment path of `file`
	const base = basename(file);

	// `dir` is all but the last segment path of `file`
	const dir = dirname(file);

	let result: ISassImportResolveResult|false = false;

	// if `base` ends with `.sass`, `.scss`, or `.css`
	if (endsWithSassExtension(base) || endsWithCssExtension(base)) {
		result = matchFile(file, options);

		// if `base` does not start with `_`
		if (!result && !startsWithPartial(base)) {
			// test whether `dir/_base` exists
			result = matchFile(join(dir, `_${base}`), options);
		}
	}

	if (!result) {
		// test whether `dir/base.scss` exists
		result = matchFile(join(dir, `${base}.scss`), options);
	}

	if (!result) {
		// test whether `dir/base.sass` exists
		result = matchFile(join(dir, `${base}.sass`), options);
	}

	if (!result) {
		// test whether `dir/base.css` exists
		result = matchFile(join(dir, `${base}.css`), options);
	}

	// if `base` does not start with `_`
	if (!result && !startsWithPartial(base)) {
		// test whether `dir/_base.scss` exists
		result = matchFile(join(dir, `_${base}.scss`), options);
	}

	// if `base` does not start with `_`
	if (!result && !startsWithPartial(base)) {
		// test whether `dir/_base.sass` exists
		result = matchFile(join(dir, `_${base}.sass`), options);
	}
	// if `base` does not start with `_`
	if (!result && !startsWithPartial(base)) {
		// test whether `dir/_base.css` exists
		result = matchFile(join(dir, `_${base}.css`), options);
	}

	if (result !== false) {
		return result;
	}

	// otherwise, if `base` does not end with `.css`
	else if (!endsWithCssExtension(base)) {
		// throw `"File to import not found or unreadable"`
		throw new Error("File to import not found or unreadable");
	}

	else {
		return undefined;
	}
}

/**
 * Gets the identifier to use within the cache
 * @param file
 * @param options
 */
function getCacheIdentifier (file: string, options: ISassImportResolveOptions): string {
	return `[${file}] - ${JSON.stringify(options)}`;
}

/* Additional tooling
/* ========================================================================== */

/**
 * Tests whether a file was matched
 * @param {string} file
 * @param {ISassImportResolveOptions} options
 * @returns {ISassImportResolveResult|false}
 */
function matchFile (file: string, options: ISassImportResolveOptions): ISassImportResolveResult|false {
	const cacheIdentifier = getCacheIdentifier(file, options);
	const cached = cache[cacheIdentifier];
	if (cached != null) return cached;

	let returnValue: ISassImportResolveResult|false = false;

	if (options.readFile) {
		try {
			returnValue = {
				file,
				contents: readFileSync(file, "utf8")
			};
		}
		catch {
			returnValue = false;
		}
	}

	else {
		try {
			const statResult = statSync(file);
			if (!statResult.isFile()) {
				returnValue = false;
			}

			returnValue = {
				file
			};
		}

		catch {
			returnValue = false;
		}
	}

	cache[cacheIdentifier] = returnValue;
	return returnValue;
}

/**
 * Returns true if the given id starts with the root selector
 * @param {string} id
 * @returns {boolean}
 */
function startsWithRoot (id: string) {
	return /^\//.test(id);
}

/**
 * Returns true if the given base starts with a Sass partial
 * @param {string} base
 * @returns {boolean}
 */
function startsWithPartial (base: string) {
	return /^_/.test(base);
}

/**
 * Returns true if the given base ends with a css extension
 * @param {string} base
 * @returns {boolean}
 */
function endsWithCssExtension (base: string) {
	return /\.css$/i.test(base);
}

/**
 * Returns true if the given base returns with a Sass extension
 * @param {string} base
 * @returns {boolean}
 */
function endsWithSassExtension (base: string) {
	return /\.s[ac]ss$/i.test(base);
}