import {IPackageJsonParserServiceOptions} from "./i-package-json-parser-service-options";
import {Observable} from "rxjs";
import {IPackageJsonParserServiceEndResult} from "./i-package-json-parser-service-result";
import {Operation} from "../../../operation/operation";

export interface IPackageJsonParserService {
	parse (options: IPackageJsonParserServiceOptions): Observable<Operation<IPackageJsonParserServiceEndResult>>;
}