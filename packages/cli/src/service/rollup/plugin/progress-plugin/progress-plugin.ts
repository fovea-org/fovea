import chalk from "chalk";
import {IProgressPluginLogger, IProgressPluginOptions} from "./i-progress-plugin-options";
import {Plugin} from "rollup";
import {isAbsolute, relative} from "path";

/**
 * Ensures that the given path is relative
 * @param {string} root
 * @param {string} path
 * @returns {string}
 */
function ensureRelative (root: string, path: string): string {
	// If the path is already relative, simply return it
	if (!isAbsolute(path)) {
		return path;
	}

	// Otherwise, construct a relative path from the root
	return relative(root, path);
}

const DEFAULT_LOGGER: IProgressPluginLogger = {
	log: () => {},
	clear: () => {},
	color: "red"
};

// tslint:disable:no-any

/**
 * A plugin that reports on build progress
 * @param {IProgressPluginLogger} logger
 * @param {string} cwd
 * @returns {Plugin}
 */
export default function progressRollupPlugin ({logger = DEFAULT_LOGGER, cwd = process.cwd()}: Partial<IProgressPluginOptions> = {}): Plugin {
	let total: number = 0;

	return {
		name: "Progress Rollup Plugin",

		/**
		 * Invoked for each file that is being transformed
		 * @param {string} _
		 * @param {string} file
		 */
		transform (_, file): void {
			total++;
			const relativePath = ensureRelative(cwd, file);
			logger.log(`(${chalk[logger.color](String(total))}): ${relativePath}`);
		},

		/**
		 * Invoked when a bundle has been generated
		 */
		ongenerate () {
			total = 0;
			logger.clear();
		}

	};
}