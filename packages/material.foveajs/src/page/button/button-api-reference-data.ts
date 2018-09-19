import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const BUTTON_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "contained",
		type: "boolean",
		defaultValue: false,
		description: "If true, the ButtonComponent will have a background color and some elevation",
		usage: `<button-component contained>Button</button-component>`
	},
	{
		prop: "outlined",
		type: "boolean",
		defaultValue: false,
		description: "If true, the ButtonComponent will have a colored border as well as colored text, but no background color",
		usage: `<button-component outlined>Button</button-component>`
	},
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the ButtonComponent will be disabled",
		usage: `<button-component disabled>Button</button-component>`
	}
];