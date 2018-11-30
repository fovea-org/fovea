import {IRollupServiceConsumer} from "../../rollup/rollup-service/i-rollup-service-consumer";

export type IManifestJsonParserServiceOptions = IRollupServiceConsumer & {
	tag: string;
};