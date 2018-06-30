import {IPackageJsonParserServiceOptions} from "./i-package-json-parser-service-options";
import {IPackageJson} from "../../../package-json/i-package-json";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IPackageJsonParserService {
	parse (options: IPackageJsonParserServiceOptions, subscriber: ISubscriber<IPackageJson>): IObserver;
}