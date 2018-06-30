import {IAssetOptimizerServiceOptions} from "./i-asset-optimizer-service-options";

export interface IAssetOptimizerServiceOptimizeOptions extends IAssetOptimizerServiceOptions {
	buffer: Buffer;
	path: string;
}