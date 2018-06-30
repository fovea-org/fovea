import {DIContainer} from "@wessberg/di";
import {FoveaStylesHost} from "./fovea-style/fovea-styles-host";
import {IPostCSS} from "./postcss/i-postcss";
import {PostCSS} from "./postcss/postcss";
import {IFoveaStylesHost} from "./fovea-style/i-fovea-styles-host";
import {IPostCSSConfiguration} from "./postcss/i-postcss-configuration";
import {postCSSConfiguration} from "./postcss/postcss-configuration";
import {PostCSSFoveaCSSParserFunction, PostCSSFoveaSCSSParserFunction, postCSSFoveaCSSParser, postCSSFoveaSCSSParser} from "@fovea/postcss-fovea-parser";

DIContainer.registerSingleton<IFoveaStylesHost, FoveaStylesHost>();
DIContainer.registerSingleton<IPostCSSConfiguration, IPostCSSConfiguration>(() => postCSSConfiguration);
DIContainer.registerSingleton<PostCSSFoveaCSSParserFunction, PostCSSFoveaCSSParserFunction>(() => postCSSFoveaCSSParser);
DIContainer.registerSingleton<PostCSSFoveaSCSSParserFunction, PostCSSFoveaSCSSParserFunction>(() => postCSSFoveaSCSSParser);
DIContainer.registerSingleton<IPostCSS, PostCSS>();