import {FoveaHostConstructor, IUseItem, Json} from "@fovea/common";
import {___useStaticCSS} from "../use-static-css/use-static-css";
import {___useStaticTemplate} from "../use-static-template/use-static-template";

/**
 * Registers a host for using the items it receives
 * @param {Json} _host
 * @param {IUseItem[]} items
 * @private
 */
export function ___use (_host: Json, items: IUseItem[]): void {
	const host = _host as FoveaHostConstructor;
	items.forEach(([kind, hash]) => {
		switch (kind) {
			case "styles":
				return ___useStaticCSS(hash, host);
			case "template":
				return ___useStaticTemplate(hash, host);
		}
	});
}