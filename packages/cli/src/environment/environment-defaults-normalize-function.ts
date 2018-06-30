import stringifyObject from "stringify-object";
import {NormalizeFunction} from "../normalize/normalize-function";
import {IEnvironmentDefaults} from "./i-environment-defaults";

/**
 * A normalize function that retrieves a proper IEnvironmentDefaults
 * @param {IBuildConfig} config
 * @param {Partial<IEnvironmentDefaults>} options
 * @returns {Promise<IStringifiableConfig<IEnvironmentDefaults>>}
 */
export const environmentDefaultsNormalizeFunction: NormalizeFunction<IEnvironmentDefaults> = async ({config, options}) => ({
	config: {
		NODE_ENV: "development",
		NPM_PACKAGE_NAME: "",
		NPM_PACKAGE_DESCRIPTION: "",
		NPM_PACKAGE_VERSION: "",
		MODULE_KIND: "",
		WATCH: "",
		TAG: "",
		RESOURCE: "{}",
		HASH: "",
		...options
	},

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return stringifyObject(this.config, config.stringifyObjectOptions);
	}
});