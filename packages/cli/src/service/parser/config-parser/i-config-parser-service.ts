import {IConfigParserServiceOptions} from "./i-config-parser-service-options";
import {Observable} from "rxjs";
import {IConfigParserServiceEndResult} from "./i-config-parser-service-result";
import {Operation} from "../../../operation/operation";

export interface IConfigParserService {
	parse (options: IConfigParserServiceOptions): Observable<Operation<IConfigParserServiceEndResult>>;
}