import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {RADIO_BUTTON_API_REFERENCE_DATA} from "./radio-button-api-reference-data";
import {RadioButtonComponent, ButtonComponent} from "@fovea/material";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Radio Button route
 */
@templateSrc("./radio-button-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./radio-button-page-component.scss"
])
@dependsOn(RadioButtonComponent, ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class RadioButtonPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for RadioButtons to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = RADIO_BUTTON_API_REFERENCE_DATA;
}
