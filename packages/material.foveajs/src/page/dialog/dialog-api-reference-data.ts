import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const DIALOG_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "open",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Dialog will be visible",
		usage: `<dialog-component open></dialog-component>`
	},
	{
		prop: "dismissable",
		type: "boolean",
		defaultValue: true,
		description: "If true, the Dialog is dismissable by clicking on the scrim or with the ESCAPE key",
		usage: `<dialog-component dismissable></dialog-component>`
	},
	{
		prop: "scrim",
		type: "boolean",
		defaultValue: true,
		description: "If true, the Dialog will have a scrim (sometimes called a 'backdrop')",
		usage: `<dialog-component scrim></dialog-component>`
	},
	{
		prop: "autoClose",
		type: "boolean",
		defaultValue: true,
		description: "If true, the Dialog will automatically toggle 'open' when a dialog action is clicked, or if it is dismissable and either the ESCAPE key is pressed or the scrim is clicked. If not true, you'll have to manually toggling the dialog visibility with the 'open' property",
		usage: `<dialog-component scrim></dialog-component>`
	}
];