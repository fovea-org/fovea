import {ICustomAttributeConstructor, IFoveaHostConstructor, IUseItem} from "@fovea/common";
import {__useStaticCSS} from "../use-static-css/use-static-css";
import {__useStaticTemplate} from "../use-static-template/use-static-template";

/**
 * Registers a host for using the items it receives
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {IUseItem[]} items
 * @private
 */
export function __use (host: IFoveaHostConstructor|ICustomAttributeConstructor, items: IUseItem[]): void {
	items.forEach(([kind, hash]) => {
		switch (kind) {
			case "styles":
				return __useStaticCSS(hash, host);
			case "template":
				return __useStaticTemplate(hash, host);
		}
	});
}