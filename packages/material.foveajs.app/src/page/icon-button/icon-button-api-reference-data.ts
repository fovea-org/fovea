import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const ICON_BUTTON_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "icon",
		type: "string",
		defaultValue: undefined,
		description: "The selector for the icon to use. The icon must known by the IconComponent",
		usage: `<icon-button-component icon="heart"></icon-button-component>`
	},
	{
		prop: "toggledIcon",
		type: "string",
		defaultValue: undefined,
		description: "The selector for the icon to use when the IconButtonComponent is toggled. If 'toggleable' is not also provided, this icon will never be used.",
		usage: `<icon-button-component icon="heart" toggledIcon="heart-fill" toggleable></icon-button-component>`
	},
	{
		prop: "toggleable",
		type: "boolean",
		defaultValue: false,
		description: "If true, the IconButtonComponent will toggle the 'toggled' attribute on/off for each time it is clicked. If a 'toggledIcon' is provided, it will switch between the provided icons",
		usage: `<icon-button-component icon="heart" toggledIcon="heart-fill" toggleable></icon-button-component>`
	},
	{
		prop: "toggled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the IconButtonComponent will be toggled by default",
		usage: `<icon-button-component icon="heart" toggledIcon="heart-fill" toggleable toggled></icon-button-component>`
	},
];