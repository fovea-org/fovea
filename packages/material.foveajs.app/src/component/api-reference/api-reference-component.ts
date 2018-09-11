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
	@prop tableHead: string = "API Reference";
	@prop data: IApiReferenceData[]|undefined;
}
