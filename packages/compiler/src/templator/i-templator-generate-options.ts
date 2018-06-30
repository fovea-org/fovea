import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {ITemplatorBaseOptions} from "./i-templator-base-options";

export interface ITemplatorGenerateOptions extends ITemplatorBaseOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
}