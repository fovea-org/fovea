import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {IconComponent, IconButtonComponent, ICON_ALARM, ICON_ALARM_FILL, ICON_BELL, ICON_BELL_FILL, ICON_HEART, ICON_HEART_FILL} from "@fovea/material";
import {ICON_BUTTON_API_REFERENCE_DATA} from "./icon-button-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

// Add the icons that is going to be used within the template
IconComponent.addIcons(ICON_HEART, ICON_HEART_FILL, ICON_ALARM, ICON_ALARM_FILL, ICON_BELL, ICON_BELL_FILL);

/**
 * This component represents the IconButton route
 */
@templateSrc("./icon-button-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./icon-button-page-component.scss"
])
@dependsOn(IconButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class IconButtonPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for IconButtonComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = ICON_BUTTON_API_REFERENCE_DATA;
}
