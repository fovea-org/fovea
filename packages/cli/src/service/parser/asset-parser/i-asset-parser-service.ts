import {IAssetParserServiceOptions} from "./i-asset-parser-service-options";
import {IAssetParserServiceResult} from "./i-asset-parser-service-result";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IAssetParserService {
	parse (options: IAssetParserServiceOptions, subscriber: ISubscriber<IAssetParserServiceResult>): IObserver;
}