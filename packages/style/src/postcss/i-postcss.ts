import {IPostCSSProcessOptions} from "./i-postcss-process-options";
import {IPostCSSProcessResult} from "./i-postcss-process-result";

export interface IPostCSS {
	process (options: IPostCSSProcessOptions): Promise<IPostCSSProcessResult>;
}