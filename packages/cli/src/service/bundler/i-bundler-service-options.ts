import {IOutputPath} from "../../output-path/i-output-path";
import {ModuleFormat, Plugin} from "rollup";
import {IRollupServiceConsumer} from "../rollup/rollup-service/i-rollup-service-consumer";
import {IRollupErrorObserver} from "../rollup/rollup-service/i-rollup-service-generate-options";
import {IRollupPrePluginsOptions} from "../rollup/rollup-service/i-rollup-pre-plugins-options";

export type IBundlerServiceOptions = IRollupServiceConsumer & {
	outputPaths: IOutputPath;
	bundleName: string;
	hash: string;
	context?: "window"|"self";
	plugins?: Plugin[];
	format: ModuleFormat;
	watch?: boolean;
	errorObserver: IRollupErrorObserver;
	progress?: IRollupPrePluginsOptions["progress"];
};