import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IConfigParserServiceOptions} from "./i-config-parser-service-options";
import {IRollupServiceGenerateWithResultResult} from "../../rollup/rollup-service/i-rollup-service-generate-with-result-result";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

export interface IConfigParserService {
	parse (options: IConfigParserServiceOptions, callback: ISubscriber<IRollupServiceGenerateWithResultResult<IFoveaCliConfig>>): IObserver;
}