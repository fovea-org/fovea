import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const CHECKBOX_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "checked",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Checkbox will be in its' checked state",
		usage: `<checkbox-component checked></checkbox-component>`
	},
	{
		prop: "indeterminate",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Checkbox will be in an indeterminate state",
		usage: `<checkbox-component indeterminate></checkbox-component>`
	},
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Checkbox will be disabled",
		usage: `<checkbox-component disabled></checkbox-component>`
	},
	{
		prop: "readonly",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Checkbox will look normal, but not be editable",
		usage: `<checkbox-component readonly></checkbox-component>`
	},
	{
		prop: "required",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Checkbox will be required to be 'checked'. This is useful within forms",
		usage: `<checkbox-component required></checkbox-component>`
	},
	{
		prop: "name",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Checkbox within a form. Useful for form submissions.",
		usage: `<checkbox-component name="something"></checkbox-component>`
	},
	{
		prop: "value",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Checkbox value within a form. Useful for form submissions.",
		usage: `<checkbox-component value="on"></checkbox-component>`
	}
];