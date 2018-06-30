import stringifyObject from "stringify-object";
import {NormalizeFunction} from "../normalize/normalize-function";
import deepExtend from "deep-extend";
import {ITslintConfiguration} from "./i-tslint-configuration";

/**
 * A normalize function that retrieves proper ITslintConfiguration for tslint
 * @param {IBuildConfig} config
 * @param {Partial<ITslintConfiguration>} options
 * @returns {Promise<IStringifiableConfig<ITslintConfiguration>>}
 */
export const tslintNormalizeFunction: NormalizeFunction<ITslintConfiguration> = async ({config, options}) => ({
	config: {
		...deepExtend(<Partial<ITslintConfiguration>>{
			rules: {}
		}, options)
	},

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return stringifyObject(this.config, config.stringifyObjectOptions);
	}
});