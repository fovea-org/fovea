import {IRollupServiceConsumer} from "../../rollup/rollup-service/i-rollup-service-consumer";

export interface IManifestJsonParserServiceOptions extends IRollupServiceConsumer {
	tag: string;
}