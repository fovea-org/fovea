import {DIContainer} from "@wessberg/di";
import {FoveaStylesHost} from "./fovea-style/fovea-styles-host";
import {IPostCSS} from "./postcss/i-postcss";
import {PostCSS} from "./postcss/postcss";
import {IFoveaStylesHost} from "./fovea-style/i-fovea-styles-host";
import {IPostCSSConfiguration} from "./postcss/i-postcss-configuration";
import {postCSSConfiguration} from "./postcss/postcss-configuration";

export const container = new DIContainer();
container.registerSingleton<IFoveaStylesHost, FoveaStylesHost>();
container.registerSingleton<IPostCSSConfiguration, IPostCSSConfiguration>(() => postCSSConfiguration);
container.registerSingleton<IPostCSS, PostCSS>();