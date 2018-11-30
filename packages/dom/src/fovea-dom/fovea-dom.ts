import {IFoveaDOM} from "./i-fovea-dom";
import {IFoveaDOMResult} from "./i-fovea-dom-result";
import {IFoveaDOMHost} from "./i-fovea-dom-host";
import {FoveaDOMOptions} from "./i-fovea-dom-options";
import {container} from "../services";

/**
 * A FoveaDOM class meant for public consumption. This shadows the actual FoveaDOMHost class to ensure
 * that it can be used without having to dependency inject it when clients consume it.
 */
export class FoveaDOM implements IFoveaDOM {
	constructor () {
		return container.get<IFoveaDOMHost>();
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of IFoveaDOM
	 * @param {FoveaDOMOptions} options
	 * @returns {IFoveaDOMResult}
	 */
	public generate (options: FoveaDOMOptions): IFoveaDOMResult {
		throw new Error(options.toString());
	}
}