import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const RADIO_BUTTON_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "checked",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Radio Button will be in its' checked state. There can only be one checked Radio Button in a group (identified by the 'name' property) at a time",
		usage: `<radio-button-component name="my-group" checked></radio-button-component>`
	},
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Radio Button will be disabled",
		usage: `<radio-button-component disabled></radio-button-component>`
	},
	{
		prop: "readonly",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Radio Button will look normal, but not be editable",
		usage: `<radio-button-component readonly></radio-button-component>`
	},
	{
		prop: "required",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Radio Button must be 'checked', or another Radio Button with the same name must be checked. This is useful within forms",
		usage: `<radio-button-component name="my-group" required></radio-button-component>`
	},
	{
		prop: "name",
		type: "string",
		defaultValue: undefined,
		description: "The name/group of the Radio Button within a form. All Radio Buttons with the same name are part of the same group. Only one Radio Button within a group can be checked at a time. Useful for form submissions.",
		usage: `<radio-button-component name="my-group"></radio-button-component>`
	},
	{
		prop: "value",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Radio Button value within a form. Useful for form submissions.",
		usage: `<radio-button-component value="on"></radio-button-component>`
	}
];