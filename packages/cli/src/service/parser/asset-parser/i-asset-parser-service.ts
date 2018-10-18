import {IAssetParserServiceOptions} from "./i-asset-parser-service-options";
import {Observable} from "rxjs";
import {Operation} from "../../../operation/operation";
import {IAssetParserServiceEndResult} from "./i-asset-parser-service-result";

export interface IAssetParserService {
	parse (options: IAssetParserServiceOptions): Observable<Operation<IAssetParserServiceEndResult>>;
}