import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

const formItemApiReferenceData = (selector: string, component: string): IApiReferenceData[] => [
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: `If true, the ${component} will be disabled`,
		usage: `<${selector} disabled></${selector}>`
	},
	{
		prop: "readonly",
		type: "boolean",
		defaultValue: false,
		description: `If true, the ${component} will look normal, but not be editable`,
		usage: `<${selector} readonly></${selector}>`
	},
	{
		prop: "required",
		type: "boolean",
		defaultValue: false,
		description: `If true, the HTML5 validity of the ${component} must be truthy and it must have a value. This is useful within forms`,
		usage: `<${selector} required></${selector}>`
	},
	{
		prop: "name",
		type: "string",
		defaultValue: undefined,
		description: `The name of the ${component} within a form. Useful for form submissions.`,
		usage: `<${selector} name="something"></${selector}>`
	},
	{
		prop: "value",
		type: "string",
		defaultValue: undefined,
		description: `The textual value of the ${component}. Can be get/set as an attribute or a property`,
		usage: `<${selector} value="This is the value of the ${component}"></${selector}>`
	}
];

const textFieldBaseApiReferenceData = (selector: string, component: string): IApiReferenceData[] => [
	{
		prop: "filled",
		type: "boolean",
		defaultValue: false,
		description: `Holds true if the ${component} should be filled. The fill color can be set with the CSS Custom property '--color-fill'`,
		usage: `<${selector} filled></${selector}>`
	},
	{
		prop: "outlined",
		type: "boolean",
		defaultValue: false,
		description: `Holds true if the ${component} should be outlined.`,
		usage: `<${selector} outlined></${selector}>`
	},
	{
		prop: "helper",
		type: "string",
		defaultValue: undefined,
		description: `The helper text to use within the ${component} (the text that will appear below it)`,
		usage: `<${selector} helper="Write a story about yourself"></${selector}>`
	},
	{
		prop: "label",
		type: "string",
		defaultValue: undefined,
		description: `The label text to use within the ${component}`,
		usage: `<${selector} label="Firstname"></${selector}>`
	},
	{
		prop: "autocomplete",
		type: `"on"|"off"`,
		defaultValue: undefined,
		description: `Whether or not autocomplete should be used for the ${component}`,
		usage: `<${selector} autocomplete="on"></${selector}>`
	},
	{
		prop: "maxlength",
		type: `number`,
		defaultValue: undefined,
		description: `The maximum amount of input characters`,
		usage: `<${selector} maxlength="20"></${selector}>`
	},
	{
		prop: "minlength",
		type: `number`,
		defaultValue: undefined,
		description: `The minimum amount of input characters`,
		usage: `<${selector} minlength="10"></${selector}>`
	}
];

export const SINGLE_LINE_TEXT_FIELD_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "type",
		type: `string`,
		defaultValue: "text",
		description: `The type of input. Must be any of the HTML5 input types. (for example, 'number', 'email', 'url', etc)`,
		usage: `<single-line-text-field-component type="number"></single-line-text-field-component>`
	},
	{
		prop: "leadingIcon",
		type: `string`,
		defaultValue: undefined,
		description: `A leading icon to display. Must be a selector for an icon that has been registered with the IconComponent`,
		usage: `<single-line-text-field-component leadingIcon="calendar"></single-line-text-field-component>`
	},
	{
		prop: "leadingIconVisibility",
		type: `"invalid"|"valid"|"both"`,
		defaultValue: "both",
		description: `Dictates under which circumstances to display the leading icon. For example, if 'invalid', the leading icon will only be visible when the input is invalid.`,
		usage: `<single-line-text-field-component leadingIcon="send" leadingIconVisibility="valid"></single-line-text-field-component>`
	},
	{
		prop: "trailingIcon",
		type: `string`,
		defaultValue: undefined,
		description: `A trailing icon to display. Must be a selector for an icon that has been registered with the IconComponent`,
		usage: `<single-line-text-field-component trailingIcon="calendar"></single-line-text-field-component>`
	},
	{
		prop: "trailingIconVisibility",
		type: `"invalid"|"valid"|"both"`,
		defaultValue: "both",
		description: `Dictates under which circumstances to display the trailing icon. For example, if 'invalid', the trailing icon will only be visible when the input is invalid.`,
		usage: `<single-line-text-field-component trailingIcon="error" trailingIconVisibility="invalid"></single-line-text-field-component>`
	},
	{
		prop: "invalidText",
		type: `string`,
		defaultValue: undefined,
		description: `Optionally, the error text to show instead of the helper when the input is invalid`,
		usage: `<single-line-text-field-component helper="This is some helper text" invalidText="This text will show when the input is invalid"></single-line-text-field-component>`
	},
	{
		prop: "min",
		type: `string`,
		defaultValue: undefined,
		description: `The 'min' value to use (useful with week, month, date, or time inputs)`,
		usage: `<single-line-text-field-component type="date" min="2018-01-30"></single-line-text-field-component>`
	},
	{
		prop: "max",
		type: `string`,
		defaultValue: undefined,
		description: `The 'max' value to use (useful with week, month, date, or time inputs)`,
		usage: `<single-line-text-field-component type="date" max="2018-01-30"></single-line-text-field-component>`
	},
	{
		prop: "pattern",
		type: `string`,
		defaultValue: undefined,
		description: `The HTML5 validation pattern to use for the input`,
		usage: `<single-line-text-field-component pattern="[A-Za-z]{3}"></single-line-text-field-component>`
	},
	...textFieldBaseApiReferenceData("single-line-text-field-component", "SingleLineTextFieldComponent"),
	...formItemApiReferenceData("single-line-text-field-component", "SingleLineTextFieldComponent")
];

export const MULTI_LINE_TEXT_FIELD_API_REFERENCE_DATA: IApiReferenceData[] = [
	...textFieldBaseApiReferenceData("multi-line-text-field-component", "MultiLineTextFieldComponent"),
	...formItemApiReferenceData("multi-line-text-field-component", "MultiLineTextFieldComponent")
];

export const TEXTAREA_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "rows",
		type: `number`,
		defaultValue: undefined,
		description: `The number of visible text lines for the textarea.`,
		usage: `<textarea-component rows="5"></textarea-component>`
	},
	{
		prop: "cols",
		type: `number`,
		defaultValue: undefined,
		description: `The visible width of the text field, in average character widths. If it is specified, it must be a positive integer.`,
		usage: `<textarea-component cols="20"></textarea-component>`
	},
	{
		prop: "resize",
		type: `string`,
		defaultValue: "vertical",
		description: `Whether or not the textarea may be resized, and if so, how. Can be any of the following: "horizontal", "vertical", "none", "both", or "revert"`,
		usage: `<textarea-component cols="20"></textarea-component>`
	},
	...textFieldBaseApiReferenceData("textarea-component", "TextareaComponent"),
	...formItemApiReferenceData("textarea-component", "TextareaComponent")
];