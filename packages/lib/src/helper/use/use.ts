import {FoveaHostConstructor, IUseItem} from "@fovea/common";
import {___useStaticCSS} from "../use-static-css/use-static-css";
import {___useStaticTemplate} from "../use-static-template/use-static-template";

/**
 * Registers a host for using the items it receives
 * @param {FoveaHostConstructor} host
 * @param {IUseItem[]} items
 * @private
 */
export function ___use (host: FoveaHostConstructor, items: IUseItem[]): void {
	items.forEach(([kind, hash]) => {
		switch (kind) {
			case "styles":
				return ___useStaticCSS(hash, host);
			case "template":
				return ___useStaticTemplate(hash, host);
		}
	});
}