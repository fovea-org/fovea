import {IFoveaStylesOptions} from "./i-fovea-styles-options";
import {IFoveaStylesResult} from "./i-fovea-styles-result";
import {IFoveaStylesTakeVariablesResult} from "./i-fovea-styles-take-variables-result";
import {IFoveaStylesTakeVariablesOptions} from "./i-fovea-styles-take-variables-options";
import {IFoveaStylesTakeImportPathsOptions} from "./i-fovea-styles-take-import-paths-options";
import {IFoveaStylesTakeImportPathsResult} from "./i-fovea-styles-take-import-paths-result";

export interface IFoveaStylesHost {
	generate (options: IFoveaStylesOptions): Promise<IFoveaStylesResult>;
	takeVariables (options: IFoveaStylesTakeVariablesOptions): Promise<IFoveaStylesTakeVariablesResult>;
	takeImportPaths (options: IFoveaStylesTakeImportPathsOptions): Promise<IFoveaStylesTakeImportPathsResult>;
	clearImportResolveCache (): void;
}