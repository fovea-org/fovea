import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {IApiReferenceData} from "./i-api-reference-data";
import {Table} from "../table/table";

/**
 * This component represents an API Reference of a component
 */
@templateSrc("./api-reference-component.html")
@styleSrc(["../../style/shared.scss", "./api-reference-component.scss"])
@dependsOn(Table)
export class ApiReferenceComponent extends HTMLElement {

	/**
	 * The label for the head of the table
	 * @type {string}
	 */
	@prop public tableHead: string = "API Reference";

	/**
	 * The data to display in the table
	 */
	@prop public data: IApiReferenceData[]|undefined;
}
