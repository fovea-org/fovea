export interface IHostAttributeValues {
	[key: string]: (string|number|boolean)|{[key: string]: (string|number|boolean)};
}