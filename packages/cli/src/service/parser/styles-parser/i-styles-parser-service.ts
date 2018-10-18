import {IStylesParserServiceOptions} from "./i-styles-parser-service-options";
import {IStylesParserServiceEndResult} from "./i-styles-parser-service-result";
import {Observable} from "rxjs";
import {Operation} from "../../../operation/operation";

export interface IStylesParserService {
	parse (options: IStylesParserServiceOptions): Observable<Operation<IStylesParserServiceEndResult>>;
}