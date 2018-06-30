import {IIndexHtmlParserServiceOptions} from "./i-index-html-parser-service-options";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IIndexHtmlParserService {
	parse (options: IIndexHtmlParserServiceOptions, subscriber: ISubscriber<IRollupServiceGenerateWithResultResult<string>>): IObserver;
}