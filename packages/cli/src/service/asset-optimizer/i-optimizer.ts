import {IOptimizerOptions} from "./i-optimizer-options";
import {IOptimizerResult} from "./i-optimizer-result";

export interface IOptimizer {
	optimize (options: IOptimizerOptions): Promise<IOptimizerResult>;
}