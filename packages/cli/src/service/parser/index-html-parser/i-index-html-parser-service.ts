import {IIndexHtmlParserServiceOptions} from "./i-index-html-parser-service-options";
import {Observable} from "rxjs";
import {IIndexHtmlParserServiceEndResult} from "./i-index-html-parser-service-result";
import {Operation} from "../../../operation/operation";

export interface IIndexHtmlParserService {
	parse (options: IIndexHtmlParserServiceOptions): Observable<Operation<IIndexHtmlParserServiceEndResult>>;
}