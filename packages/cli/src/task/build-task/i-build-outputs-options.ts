import {IAssetOptimizerServiceOptimizeDirectoryResult} from "../../service/asset-optimizer/i-asset-optimizer-service-optimize-directory-result";
import {IBuildAssetsOptions} from "./i-build-assets-options";

export interface IBuildOutputsOptions extends IBuildAssetsOptions {
	assets: IAssetOptimizerServiceOptimizeDirectoryResult;
}