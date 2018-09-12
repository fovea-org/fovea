import {customAttribute, hostAttributes, styleSrc} from "@fovea/core";

/**
 * This Custom Attribute represents a Table
 */
@customAttribute
@styleSrc(["../../style/shared.scss", "./table.scss"])
@hostAttributes({
	class: {
		table: true
	}
})
export class Table {
}
