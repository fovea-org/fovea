import {ICustomAttribute, Json} from "@fovea/common";
import {upgradeCustomAttribute} from "../../custom-attribute/upgrade-custom-attribute";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {IDestroyable} from "../../destroyable/i-destroyable";
import {construct} from "./construct";

/**
 * Constructs a new ICustomAttribute
 * @param {ICustomAttribute} _host
 * @param {Element} hostElement
 * @private
 */
export function ___constructCustomAttribute (_host: Json, hostElement: Element): void {
	const host = _host as ICustomAttribute;
	// Invoke the common construct functionality
	const baseConstructResult = construct(host, hostElement);

	// Upgrade the custom attribute
	let upgradedCustomAttribute: IDestroyable|null = upgradeCustomAttribute(host, hostElement);

	// Make sure that it can be destroyed later on
	CONSTRUCTED_HOSTS.add(host, {
		destroy: () => {
			if (upgradedCustomAttribute != null) {
				upgradedCustomAttribute.destroy();
				upgradedCustomAttribute = null;
			}
			baseConstructResult.destroy();
		}
	});
}