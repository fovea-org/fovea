import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const SWITCH_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "checked",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Switch will be in its' checked state",
		usage: `<switch-component checked></switch-component>`
	},
	{
		prop: "indeterminate",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Switch will be in an indeterminate state",
		usage: `<switch-component indeterminate></switch-component>`
	},
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Switch will be disabled",
		usage: `<switch-component disabled></switch-component>`
	},
	{
		prop: "readonly",
		type: "boolean",
		defaultValue: false,
		description: "If true, the SWitch will look normal, but not be editable",
		usage: `<switch-component readonly></switch-component>`
	},
	{
		prop: "required",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Switch will be required to be 'checked'. This is useful within forms",
		usage: `<switch-component required></switch-component>`
	},
	{
		prop: "name",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Switch within a form. Useful for form submissions.",
		usage: `<switch-component name="something"></switch-component>`
	},
	{
		prop: "value",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Switch value within a form. Useful for form submissions.",
		usage: `<switch-component value="on"></switch-component>`
	}
];