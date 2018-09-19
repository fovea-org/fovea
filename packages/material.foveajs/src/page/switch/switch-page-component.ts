import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {SwitchComponent, ButtonComponent} from "@fovea/material";
import {SWITCH_API_REFERENCE_DATA} from "./switch-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Switch route
 */
@templateSrc("./switch-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./switch-page-component.scss"
])
@dependsOn(SwitchComponent, ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class SwitchPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for SwitchComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = SWITCH_API_REFERENCE_DATA;
}
