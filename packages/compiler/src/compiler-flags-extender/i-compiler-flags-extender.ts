import {ICompilerFlagsExtenderExtendOptions} from "./i-compiler-flags-extender-extend-options";
import {IImmutableCompilerHintStats} from "../stats/i-fovea-stats";
import {FoveaHostMarkerMarkResult} from "../fovea-marker/fovea-host-marker-mark-result";

export interface ICompilerFlagsExtender {
	extend (options: ICompilerFlagsExtenderExtendOptions): void;
	getCompilerFlags (file: string): string;
	getStatsFromCompilerFlagsForComponent (mark: FoveaHostMarkerMarkResult): IImmutableCompilerHintStats;
}