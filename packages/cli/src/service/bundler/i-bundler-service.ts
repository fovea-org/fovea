import {IBundlerServiceOptions} from "./i-bundler-service-options";
import {IBundlerServiceBundlingEndedResult} from "./i-bundler-service-bundling-ended-data";
import {Observable} from "rxjs";
import {Operation} from "../../operation/operation";

export interface IBundlerService {
	generate (options: IBundlerServiceOptions): Observable<Operation<IBundlerServiceBundlingEndedResult>>;
}