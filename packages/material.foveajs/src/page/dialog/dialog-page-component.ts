import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IRouterTarget} from "@fovea/router";
import {ButtonComponent, RadioButtonComponent, DialogAction, openDialog, DialogComponent, ICON_CHECK, ICON_CLOSE, ICON_ZOOM_IN, IconComponent} from "@fovea/material";
import {DIALOG_API_REFERENCE_DATA} from "./dialog-api-reference-data";
import {Highlight} from "../../component/highlight/highlight";
import {ShowcaseComponent} from "../../component/showcase/showcase-component";
import {ApiReferenceComponent} from "../../component/api-reference/api-reference-component";
import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

// tslint:disable:no-any

IconComponent.addIcons(
	ICON_ZOOM_IN,
	ICON_CHECK,
	ICON_CLOSE
);

/**
 * This component represents the Dialog route
 */
@templateSrc("./dialog-page-component.html")
@styleSrc([
	"../../style/shared.scss",
	"../shared/shared.scss",
	"./dialog-page-component.scss"
])
@dependsOn(DialogComponent, RadioButtonComponent, IconComponent, ButtonComponent, Highlight, ShowcaseComponent, ApiReferenceComponent)
export default class DialogPageComponent extends HTMLElement implements IRouterTarget {

	/**
	 * An array of numbers
	 * @type {number[]}
	 */
	@prop protected listItems: number[] = [...Array(15).keys()];

	/**
	 * Holds true if a Radio Button has been selected within the scrolling dialog
	 * @type {boolean}
	 */
	@prop protected selectedScrollingDialogOption: boolean = false;

	/**
	 * The API reference data for DialogComponents to render
	 * @type {IApiReferenceData[]}
	 */
	@prop public apiReferenceData: IApiReferenceData[] = DIALOG_API_REFERENCE_DATA;

	/**
	 * The response from dialog 1
	 * @type {DialogAction}
	 */
	@prop protected dialog1Response?: DialogAction;

	/**
	 * The response from dialog 2
	 * @type {DialogAction}
	 */
	@prop protected dialog2Response?: DialogAction;

	/**
	 * The response from dialog 3
	 * @type {DialogAction}
	 */
	@prop protected dialog3Response?: DialogAction;

	/**
	 * The response from dialog 4
	 * @type {DialogAction}
	 */
	@prop protected dialog4Response?: DialogAction;

	/**
	 * The response from the imperative dialog
	 * @type {DialogAction}
	 */
	@prop protected imperativeDialogResponse?: DialogAction;

	/**
	 * Invoked when a dialog emits a response
	 * @param {number} dialogId
	 * @param {DialogAction} action
	 */
	protected onDialogAction (dialogId: 1|2|3|4, action?: DialogAction): void {
		(<any>this)[`dialog${dialogId}Response`] = action;
	}

	/**
	 * Opens a dialog imperatively
	 * @returns {Promise<void>}
	 */
	protected async openImperativeDialog (): Promise<void> {
		this.imperativeDialogResponse = await openDialog({
			title: "Fire torpedoes?",
			text: "Firing those torpedoes might make you a new enemy.",
			target: this.shadowRoot!,
			actions: [
				{
					text: "Cancel",
					action: "cancel"
				},
				{
					text: "Fire",
					action: "confirm"
				}
			]
		});
	}
}
