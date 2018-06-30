import {IAssetOptimizerServiceOptimizeDirectoryOptions} from "./i-asset-optimizer-service-optimize-directory-options";
import {IAssetOptimizerServiceOptimizeDirectoryResult} from "./i-asset-optimizer-service-optimize-directory-result";

export interface IAssetOptimizerService {
	optimizeDirectory (options: IAssetOptimizerServiceOptimizeDirectoryOptions): Promise<IAssetOptimizerServiceOptimizeDirectoryResult>;
}