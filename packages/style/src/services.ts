import {DIContainer} from "@wessberg/di";
import {FoveaStylesHost} from "./fovea-style/fovea-styles-host";
import {IPostCSS} from "./postcss/i-postcss";
import {PostCSS} from "./postcss/postcss";
import {IFoveaStylesHost} from "./fovea-style/i-fovea-styles-host";
import {IPostCSSConfiguration} from "./postcss/i-postcss-configuration";
import {postCSSConfiguration} from "./postcss/postcss-configuration";

DIContainer.registerSingleton<IFoveaStylesHost, FoveaStylesHost>();
DIContainer.registerSingleton<IPostCSSConfiguration, IPostCSSConfiguration>(() => postCSSConfiguration);
DIContainer.registerSingleton<IPostCSS, PostCSS>();