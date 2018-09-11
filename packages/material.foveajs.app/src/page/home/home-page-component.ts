import {styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";

/**
 * This component represents the App route of your application
 */
@templateSrc("./home-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./home-page-component.scss"
])
export default class HomePageComponent extends HTMLElement implements IRouterTarget {
}
