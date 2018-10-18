import {IRollupServiceConsumer} from "../../rollup/rollup-service/i-rollup-service-consumer";
import {IIndexHtmlOptions} from "../../../index-html/i-index-html-options";

export interface IIndexHtmlParserServiceOptions extends IRollupServiceConsumer, IIndexHtmlOptions {
	tag: string;
}