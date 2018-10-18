import {IRollupServiceGenerateOptions} from "./i-rollup-service-generate-options";
import {IRollupServiceGenerateWithResultOptions} from "./i-rollup-service-generate-with-result-options";
import {IRollupServiceGenerateWithResultResult} from "./i-rollup-service-generate-with-result-result";
import {IRollupServiceGenerateObserverPayload} from "./i-rollup-service-generate-observer-payload";
import {Observable} from "rxjs";
import {Operation} from "../../../operation/operation";

export interface IRollupService {
	generate (options: IRollupServiceGenerateOptions): Observable<Operation<IRollupServiceGenerateObserverPayload>>;
	generateWithResult<T> (options: IRollupServiceGenerateWithResultOptions): Promise<IRollupServiceGenerateWithResultResult<T>>;
}