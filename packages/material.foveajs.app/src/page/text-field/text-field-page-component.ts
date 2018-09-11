import {dependsOn, listener, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {MULTI_LINE_TEXT_FIELD_API_REFERENCE_DATA, SINGLE_LINE_TEXT_FIELD_API_REFERENCE_DATA, TEXTAREA_API_REFERENCE_DATA} from "./text-field-api-reference-data";
import {SingleLineTextFieldComponent, MultiLineTextFieldComponent, TextareaComponent, IconComponent, RadioButtonComponent, ICON_CALENDAR, ICON_PERSON_FILL, ICON_SEARCH, ICON_LINK, ICON_ERROR} from "@fovea/material";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";

// Add the icons that is going to be used within the template
IconComponent.addIcons(ICON_CALENDAR, ICON_SEARCH, ICON_PERSON_FILL, ICON_LINK, ICON_ERROR);

/**
 * This component represents the Text Field route of your application
 */
@templateSrc("./text-field-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./text-field-page-component.scss"
])
@dependsOn(RadioButtonComponent, SingleLineTextFieldComponent, IconComponent, MultiLineTextFieldComponent, TextareaComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class TextFieldPageComponent extends HTMLElement implements IRouterTarget {
	@prop public singleLineTextFieldApiReferenceData: IApiReferenceData[] = SINGLE_LINE_TEXT_FIELD_API_REFERENCE_DATA;
	@prop public multiLineTextFieldApiReferenceData: IApiReferenceData[] = MULTI_LINE_TEXT_FIELD_API_REFERENCE_DATA;
	@prop public textareaApiReferenceData: IApiReferenceData[] = TEXTAREA_API_REFERENCE_DATA;

	@prop protected direction?: "ltr"|"rtl";
	@prop protected $ltrRadioButton: HTMLInputElement;
	@prop protected $rtlRadioButton: HTMLInputElement;

	@listener("checked-changed", {on: "$ltrRadioButton"})
	protected onLtrRadioButtonCheckedChanged (): void {
		this.direction = this.$ltrRadioButton.checked ? "ltr" : "rtl";
	}

	@listener("checked-changed", {on: "$rtlRadioButton"})
	protected onRtlRadioButtonCheckedChanged (): void {
		this.direction = this.$rtlRadioButton.checked ? "rtl" : "ltr";
	}
}
