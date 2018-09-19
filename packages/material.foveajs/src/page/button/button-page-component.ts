import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {ButtonComponent, IconComponent, ICON_CHECK} from "@fovea/material";
import {BUTTON_API_REFERENCE_DATA} from "./button-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

// Add the icons that is going to be used within the template
IconComponent.addIcons(ICON_CHECK);

/**
 * This component represents the Button route
 */
@templateSrc("./button-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./button-page-component.scss"
])
@dependsOn(ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent, IconComponent)
export default class ButtonPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for Buttons to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = BUTTON_API_REFERENCE_DATA;
}
