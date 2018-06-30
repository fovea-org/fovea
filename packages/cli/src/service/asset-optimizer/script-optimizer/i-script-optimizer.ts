import {IScriptOptimizerOptions} from "./i-script-optimizer-options";
import {OptimizerResult} from "../i-optimizer-result";
import {IOptimizer} from "../i-optimizer";

export interface IScriptOptimizer extends IOptimizer {
	optimize (options: IScriptOptimizerOptions): Promise<OptimizerResult>;
}