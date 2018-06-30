import {IAssetOptimizerServiceOptions} from "./i-asset-optimizer-service-options";
import {IFoveaCliAssetAppIconConfig} from "../../fovea-cli-config/i-fovea-cli-config";

export interface IAssetOptimizerServiceOptimizeDirectoryOptions {
	assetMap: {[key: string]: Buffer};
	appIcon: IFoveaCliAssetAppIconConfig & {
		path: string;
		buffer: Buffer;
	};
	options: IAssetOptimizerServiceOptions;
}