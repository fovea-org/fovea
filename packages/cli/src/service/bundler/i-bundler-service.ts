import {IBundlerServiceOptions} from "./i-bundler-service-options";
import {IObserver} from "../../observable/i-observer";

export interface IBundlerService {
	generate (options: IBundlerServiceOptions): IObserver;
}