import {IImageOptimizerOptions} from "./i-image-optimizer-options";
import {OptimizerResult} from "../i-optimizer-result";
import {IOptimizer} from "../i-optimizer";

export interface IImageOptimizer extends IOptimizer {
	optimize (options: IImageOptimizerOptions): Promise<OptimizerResult>;
}