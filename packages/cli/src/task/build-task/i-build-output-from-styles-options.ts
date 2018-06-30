import {IStylesParserServiceResult} from "../../service/parser/styles-parser/i-styles-parser-service-result";
import {IOutputPath} from "../../output-path/i-output-path";
import {IBuildOutputOptions} from "./i-build-output-options";

export interface IBuildOutputFromStylesOptions extends IBuildOutputOptions {
	styles: IStylesParserServiceResult;
	outputPaths: IOutputPath;
}