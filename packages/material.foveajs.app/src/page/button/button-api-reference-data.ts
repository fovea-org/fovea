import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const BUTTON_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "contained",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Button will have a background color and some elevation",
		usage: `<button *button="contained: true">Button</button>`
	},
	{
		prop: "outlined",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Button will have a colored border as well as colored text, but no background color",
		usage: `<button *button="outlined: true">Button</button>`
	}
];