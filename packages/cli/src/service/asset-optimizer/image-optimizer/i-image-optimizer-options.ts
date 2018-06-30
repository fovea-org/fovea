import {ImageFormatKind} from "../../../format/image-format-kind";
import {IOptimizerOptions} from "../i-optimizer-options";
import {IImageOptimizer} from "./i-image-optimizer";

export interface IImageOptimizerOptions extends IOptimizerOptions {
	outputFormat: ImageFormatKind;
	parent?: IImageOptimizer;
}