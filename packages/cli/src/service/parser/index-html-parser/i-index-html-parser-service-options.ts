import {IRollupServiceConsumer} from "../../rollup/rollup-service/i-rollup-service-consumer";
import {IIndexHtmlOptions} from "../../../index-html/i-index-html-options";

export type IIndexHtmlParserServiceOptions = IRollupServiceConsumer & IIndexHtmlOptions & {
	tag: string;
};