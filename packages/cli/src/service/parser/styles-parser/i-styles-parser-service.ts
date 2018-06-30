import {IStylesParserServiceOptions} from "./i-styles-parser-service-options";
import {IStylesParserServiceResult} from "./i-styles-parser-service-result";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IStylesParserService {
	parse (options: IStylesParserServiceOptions, subscriber: ISubscriber<IStylesParserServiceResult>): IObserver;
}