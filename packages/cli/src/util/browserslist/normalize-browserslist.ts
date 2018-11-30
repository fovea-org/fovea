import {IFoveaCliOutputConfig, IFoveaCliOutputConfigNormalized} from "../../fovea-cli-config/i-fovea-cli-config";
import {ensureArray} from "../iterable/iterable-util";
import {ensureAbsolute} from "../path/path-util";
import {existsSync} from "fs";
// @ts-ignore
import {readConfig} from "browserslist";

/**
 * Normalizes the given Browserslist
 * @param {string} cwd
 * @param {IFoveaCliOutputConfig["browserslist"]} input
 * @returns {IFoveaCliOutputConfigNormalized["browserslist"]}
 */
export function normalizeBrowserslist (cwd: string, input: IFoveaCliOutputConfig["browserslist"]): IFoveaCliOutputConfigNormalized["browserslist"] {

	if (input == null || input === false) {
		return false;
	}

	else if (typeof input === "string" || Array.isArray(input)) {
		return ensureArray(input);
	}

	else if ("query" in input) {
		return ensureArray(input.query);
	}

	else if ("path" in input) {
		const browserslistPath = ensureAbsolute(cwd, input.path);
		const errorMessage = `The given path for a Browserslist: '${browserslistPath}' could not be resolved from '${cwd}'`;
		if (!existsSync(browserslistPath)) {
			throw new ReferenceError(errorMessage);
		} else {
			// Read the config
			const match = readConfig(browserslistPath);
			if (match == null) {
				throw new ReferenceError(errorMessage);
			} else {
				return match.defaults;
			}
		}
	}

	// Otherwise, default to returning false
	else {
		return false;
	}
}