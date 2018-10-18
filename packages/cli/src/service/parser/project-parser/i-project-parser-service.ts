import {IProjectParserServiceOptions} from "./i-project-parser-service-options";
import {Observable} from "rxjs";
import {IProjectParserServiceEndResult} from "./i-project-parser-service-result";
import {Operation} from "../../../operation/operation";

export interface IProjectParserService {
	parse (options: IProjectParserServiceOptions): Observable<Operation<IProjectParserServiceEndResult>>;
}