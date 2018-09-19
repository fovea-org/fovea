import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {CheckboxComponent, ButtonComponent} from "@fovea/material";
import {CHECKBOX_API_REFERENCE_DATA} from "./checkbox-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

/**
 * This component represents the Checkbox route
 */
@templateSrc("./checkbox-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./checkbox-page-component.scss"
])
@dependsOn(CheckboxComponent, ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class CheckboxPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for CheckboxComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = CHECKBOX_API_REFERENCE_DATA;
}
