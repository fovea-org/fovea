import {IFoveaCliConfig, IFoveaCliOutputConfig} from "../../fovea-cli-config/i-fovea-cli-config";
import {IAssetOptimizerServiceOptimizeDirectoryResult} from "../../service/asset-optimizer/i-asset-optimizer-service-optimize-directory-result";

export interface IGetOutputPathsForOutputOptions {
	root: string;
	foveaCliConfig: IFoveaCliConfig;
	assets?: IAssetOptimizerServiceOptimizeDirectoryResult;
	hash?: string;
	output: IFoveaCliOutputConfig;
}