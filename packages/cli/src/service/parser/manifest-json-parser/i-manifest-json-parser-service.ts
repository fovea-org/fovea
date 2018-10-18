import {IManifestJsonParserServiceOptions} from "./i-manifest-json-parser-service-options";
import {Observable} from "rxjs";
import {IManifestJsonParserServiceEndResult} from "./i-manifest-json-parser-service-result";
import {Operation} from "../../../operation/operation";

export interface IManifestJsonParserService {
	parse (options: IManifestJsonParserServiceOptions): Observable<Operation<IManifestJsonParserServiceEndResult>>;
}