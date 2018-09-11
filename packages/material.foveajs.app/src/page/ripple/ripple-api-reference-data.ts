import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const RIPPLE_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "center",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Ripple will always transform from the origin of the center of the target element",
		usage: `<div *ripple="center: true"></div>`
	},
	{
		prop: "color",
		type: "string",
		defaultValue: "currentColor",
		description: "The Ripple will use the provided color as its background color",
		usage: `<div *ripple="color: red"></div>`
	}
];