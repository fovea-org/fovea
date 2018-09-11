import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {SLIDER_API_REFERENCE_DATA} from "./slider-api-reference-data";
import {SliderComponent} from "@fovea/material";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Slider route of your application
 */
@templateSrc("./slider-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./slider-page-component.scss"
])
@dependsOn(SliderComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class SliderPageComponent extends HTMLElement implements IRouterTarget {
	@prop public apiReferenceData: IApiReferenceData[] = SLIDER_API_REFERENCE_DATA;
}
