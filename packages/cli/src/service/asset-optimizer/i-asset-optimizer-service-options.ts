import {IFoveaCliAssetOptimizationConfig} from "../../fovea-cli-config/i-fovea-cli-config";
import {FileFormatKind} from "../../format/file-format-kind";

export interface IAssetOptimizerServiceOptions extends IFoveaCliAssetOptimizationConfig {
	outputFormat?: FileFormatKind;
	assetDir: string;
}