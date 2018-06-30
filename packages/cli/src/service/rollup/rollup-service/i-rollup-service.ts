import {IRollupServiceGenerateOptions} from "./i-rollup-service-generate-options";
import {IRollupServiceGenerateWithResultOptions} from "./i-rollup-service-generate-with-result-options";
import {IRollupServiceGenerateWithResultResult} from "./i-rollup-service-generate-with-result-result";
import {IObserver} from "../../../observable/i-observer";

export interface IRollupService {
	generate (options: IRollupServiceGenerateOptions): Promise<IObserver>;
	generateWithResult<T> (options: IRollupServiceGenerateWithResultOptions): Promise<IRollupServiceGenerateWithResultResult<T>>;
}