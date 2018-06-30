import {IFoveaHostMarkerMarkOptions} from "./i-fovea-host-marker-mark-options";
import {FoveaHostMarkerMarkResult} from "./fovea-host-marker-mark-result";

export interface IFoveaHostMarker {
	mark (options: IFoveaHostMarkerMarkOptions): FoveaHostMarkerMarkResult;
}