import {ICompilationContext} from "./i-compilation-context";
import {IFoveaHostMarkerMarkExcludeResult} from "../fovea-marker/fovea-host-marker-mark-result";

export interface IFoveaUsePrecompiledFileOptions {
	marks: IFoveaHostMarkerMarkExcludeResult[];
	context: ICompilationContext;
}