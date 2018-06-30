import {IManifestJsonParserServiceOptions} from "./i-manifest-json-parser-service-options";
import {IManifestJson} from "../../../manifest-json/i-manifest-json";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IManifestJsonParserService {
	parse (options: IManifestJsonParserServiceOptions, subscriber: ISubscriber<IRollupServiceGenerateWithResultResult<IManifestJson>>): IObserver;
}