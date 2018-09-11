import {IApiReferenceData} from "../../component/api-reference/i-api-reference-data";

export const SLIDER_API_REFERENCE_DATA: IApiReferenceData[] = [
	{
		prop: "step",
		type: "number",
		defaultValue: 1,
		description: "How many numerical steps to move when the slider is panned.",
		usage: `<slider-component step="10"></slider-component>`
	},
	{
		prop: "min",
		type: "number",
		defaultValue: 0,
		description: "The minimum numerical value of the slider",
		usage: `<slider-component min="0"></slider-component>`
	},
	{
		prop: "max",
		type: "number",
		defaultValue: 100,
		description: "The maximum numerical value of the slider",
		usage: `<slider-component max="100"></slider-component>`
	},
	{
		prop: "value",
		type: "string|number",
		defaultValue: "50",
		description: "The current value of the slider. Must be greater than or equal to 'min' and less than or equal to 'max'.",
		usage: `<slider-component value="50"></slider-component>`
	},
	{
		prop: "discrete",
		type: "boolean",
		defaultValue: false,
		description: "Whether or not the slider is discrete. Discrete sliders visually display the current value in a pin above the Slider when it is being adjusted.",
		usage: `<slider-component discrete></slider-component>`
	},
	{
		prop: "tick",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Slider will display a visual tick for each 'step'. This is useful to visually indicate the steps, especially for larger values of 'step'.",
		usage: `<slider-component tick></slider-component>`
	},
	{
		prop: "disabled",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Slider will be disabled",
		usage: `<slider-component disabled></slider-component>`
	},
	{
		prop: "readonly",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Slider will look normal, but not be editable",
		usage: `<slider-component readonly></slider-component>`
	},
	{
		prop: "required",
		type: "boolean",
		defaultValue: false,
		description: "If true, the Slider will be required to have a value. This is useful within forms",
		usage: `<slider-component required></slider-component>`
	},
	{
		prop: "name",
		type: "string",
		defaultValue: undefined,
		description: "The name of the Slider within a form. Useful for form submissions.",
		usage: `<slider-component name="something"></slider-component>`
	}
];