import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {SLIDER_API_REFERENCE_DATA} from "./slider-api-reference-data";
import {SliderComponent, ButtonComponent} from "@fovea/material";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Slider route
 */
@templateSrc("./slider-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./slider-page-component.scss"
])
@dependsOn(SliderComponent, ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class SliderPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for SliderComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = SLIDER_API_REFERENCE_DATA;
}
