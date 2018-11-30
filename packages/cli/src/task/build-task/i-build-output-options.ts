import {IFoveaCliOutputConfigNormalized} from "../../fovea-cli-config/i-fovea-cli-config";
import {IBuildOutputsOptions} from "./i-build-outputs-options";

export interface IBuildOutputOptions extends IBuildOutputsOptions {
	output: IFoveaCliOutputConfigNormalized;
	index: number;
}