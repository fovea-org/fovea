import {prop, styleSrc, templateSrc} from "@fovea/core";

/**
 * This component represents a Showcase of a set of components
 */
@templateSrc("./showcase-component.html")
@styleSrc(["../../style/shared.scss", "./showcase-component.scss"])
export class ShowcaseComponent extends HTMLElement {

	/**
	 * The caption to show, if any
	 */
	@prop public caption: string|undefined;
}
