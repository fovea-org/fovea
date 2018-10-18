import {IOutputPath} from "../../output-path/i-output-path";
import {IBuildOutputOptions} from "./i-build-output-options";
import {IStylesParserServiceEndResult} from "../../service/parser/styles-parser/i-styles-parser-service-result";

export interface IBuildOutputFromStylesOptions extends IBuildOutputOptions {
	styles: IStylesParserServiceEndResult;
	outputPaths: IOutputPath;
}