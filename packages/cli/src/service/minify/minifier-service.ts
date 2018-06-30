import {IMinifierService} from "./i-minifier-service";
import {IMinifierServiceOptions} from "./i-minifier-service-options";
import {IBabelMinifyOptions} from "./i-babel-minify-options";
// @ts-ignore
import minify from "babel-minify";

/**
 * A class that helps with minifying code
 */
export class MinifierService implements IMinifierService {
	constructor (private readonly minifyOptions: IBabelMinifyOptions) {
	}

	/**
	 * Minifies the given code based on the given options
	 * @param {IMinifierServiceOptions} options
	 * @returns {string}
	 */
	public minify (options: IMinifierServiceOptions): string {
		const {code} = minify(options.code.toString(), this.minifyOptions, {sourceMaps: false});
		return code;
	}

}