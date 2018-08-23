import {IFoveaStyles} from "./i-fovea-styles";
import {DIContainer} from "@wessberg/di";
import {IFoveaStylesResult} from "./i-fovea-styles-result";
import {IFoveaStylesOptions} from "./i-fovea-styles-options";
import {IFoveaStylesHost} from "./i-fovea-styles-host";
import {IFoveaStylesTakeVariablesOptions} from "./i-fovea-styles-take-variables-options";
import {IFoveaStylesTakeVariablesResult} from "./i-fovea-styles-take-variables-result";
import {IFoveaStylesTakeImportPathsOptions} from "./i-fovea-styles-take-import-paths-options";
import {IFoveaStylesTakeImportPathsResult} from "./i-fovea-styles-take-import-paths-result";

/**
 * A FoveaStyles class meant for public consumption. This shadows the actual FoveaStylesHost class to ensure
 * that it can be used without having to dependency inject it when clients consume it.
 */
export class FoveaStyles implements IFoveaStyles {
	constructor () {
		return DIContainer.get<IFoveaStylesHost>();
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of IFoveaStyles
	 * @param {IFoveaStylesOptions} options
	 * @returns {Promise<IFoveaStylesResult>}
	 */
	public async generate (options: IFoveaStylesOptions): Promise<IFoveaStylesResult> {
		throw new Error(options.toString());
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of IFoveaStyles
	 * @param {IFoveaStylesTakeVariablesOptions} options
	 * @returns {Promise<IFoveaStylesTakeVariablesResult>}
	 */
	public async takeVariables (options: IFoveaStylesTakeVariablesOptions): Promise<IFoveaStylesTakeVariablesResult> {
		throw new Error(options.toString());
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of IFoveaStyles
	 * @param {IFoveaStylesTakeImportPathsOptions} options
	 * @returns {Promise<IFoveaStylesTakeImportPathsResult>}
	 */
	public async takeImportPaths (options: IFoveaStylesTakeImportPathsOptions): Promise<IFoveaStylesTakeImportPathsResult> {
		throw new Error(options.toString());
	}

	/**
	 * This is a noop. The constructor returns the proper implementation of IFoveaStyles
	 */
	public clearImportResolveCache (): void {
		throw new Error();
	}
}