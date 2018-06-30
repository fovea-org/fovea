import {FileFormatKind} from "../../format/file-format-kind";
import {IFoveaCliAssetOptimizationConfig} from "../../fovea-cli-config/i-fovea-cli-config";

export interface IOptimizerOptions extends IFoveaCliAssetOptimizationConfig {
	buffer: Buffer;
	path: string;
	outputFormat: FileFormatKind;
}