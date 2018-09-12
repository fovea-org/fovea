import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {RippleComponent} from "@fovea/material";
import {RIPPLE_API_REFERENCE_DATA} from "./ripple-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Ripple route
 */
@templateSrc("./ripple-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./ripple-page-component.scss"
])
@dependsOn(RippleComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class RipplePageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for Ripples to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = RIPPLE_API_REFERENCE_DATA;
}
