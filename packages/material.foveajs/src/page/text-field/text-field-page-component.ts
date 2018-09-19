import {dependsOn, listener, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {MULTI_LINE_TEXT_FIELD_API_REFERENCE_DATA, SINGLE_LINE_TEXT_FIELD_API_REFERENCE_DATA, TEXTAREA_API_REFERENCE_DATA} from "./text-field-api-reference-data";
import {SingleLineTextFieldComponent, MultiLineTextFieldComponent, ButtonComponent, TextareaComponent, IconComponent, RadioButtonComponent, ICON_CALENDAR, ICON_PERSON_FILL, ICON_SEARCH, ICON_LINK, ICON_ERROR} from "@fovea/material";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";

// Add the icons that is going to be used within the template
IconComponent.addIcons(ICON_CALENDAR, ICON_SEARCH, ICON_PERSON_FILL, ICON_LINK, ICON_ERROR);

/**
 * This component represents the Text Field route
 */
@templateSrc("./text-field-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./text-field-page-component.scss"
])
@dependsOn(RadioButtonComponent, ButtonComponent, SingleLineTextFieldComponent, IconComponent, MultiLineTextFieldComponent, TextareaComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class TextFieldPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * The API reference data for SingleLineTextFieldComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public singleLineTextFieldApiReferenceData: IApiReferenceData[] = SINGLE_LINE_TEXT_FIELD_API_REFERENCE_DATA;

	/**
	 * The API reference data for MultiLineTextFieldComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public multiLineTextFieldApiReferenceData: IApiReferenceData[] = MULTI_LINE_TEXT_FIELD_API_REFERENCE_DATA;

	/**
	 * The API reference data for TextareaComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public textareaApiReferenceData: IApiReferenceData[] = TEXTAREA_API_REFERENCE_DATA;

	/**
	 * The current direction to display the text fields in
	 */
	@prop protected direction?: "ltr"|"rtl";

	/**
	 * A reference to the inner RadioButtonComponent representing left-to-right directions
	 * @type {HTMLInputElement}
	 */
	@prop protected $ltrRadioButton: HTMLInputElement;

	/**
	 * A reference to the inner RadioButtonComponent representing right-to-left directions
	 * @type {HTMLInputElement}
	 */
	@prop protected $rtlRadioButton: HTMLInputElement;

	/**
	 * Invoked when the 'checked' property changes on the left-to-right RadioButtonComponent
	 */
	@listener("checked-changed", {on: "$ltrRadioButton"})
	protected onLtrRadioButtonCheckedChanged (): void {
		this.direction = this.$ltrRadioButton.checked ? "ltr" : "rtl";
	}

	/**
	 * Invoked when the 'checked' property changes on the right-to-left RadioButtonComponent
	 */
	@listener("checked-changed", {on: "$rtlRadioButton"})
	protected onRtlRadioButtonCheckedChanged (): void {
		this.direction = this.$rtlRadioButton.checked ? "rtl" : "ltr";
	}
}
