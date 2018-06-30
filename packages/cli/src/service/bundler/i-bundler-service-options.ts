import {IOutputPath} from "../../output-path/i-output-path";
import {ModuleFormat, Plugin} from "rollup";
import {IRollupServiceConsumer} from "../rollup/rollup-service/i-rollup-service-consumer";
import {ISubscriber} from "../../observable/i-subscriber";
import {IBundlerServiceBundlingEndedData} from "./i-bundler-service-bundling-ended-data";

export interface IBundlerServiceOptions extends IRollupServiceConsumer {
	outputPaths: IOutputPath;
	bundleName: string;
	hash: string;
	context?: "window"|"self";
	plugins?: Plugin[];
	format: ModuleFormat;
	banner?: string;
	watch?: boolean;
	observer: ISubscriber<IBundlerServiceBundlingEndedData>;
}