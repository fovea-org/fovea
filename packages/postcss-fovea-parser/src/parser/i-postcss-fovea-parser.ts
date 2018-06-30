import {Json} from "@fovea/common";
import {Root} from "postcss";

export interface IPostCSSFoveaParser {
	createTokenizer (): void;
	parse (): void;
}

export declare type PostCSSFoveaParserFunction = (css: string, opts: Json) => Root;
export declare type PostCSSFoveaCSSParserFunction = PostCSSFoveaParserFunction;
export declare type PostCSSFoveaSCSSParserFunction = PostCSSFoveaParserFunction;