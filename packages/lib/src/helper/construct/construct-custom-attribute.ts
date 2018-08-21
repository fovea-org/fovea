import {ICustomAttribute} from "@fovea/common";
import {upgradeCustomAttribute} from "../../custom-attribute/upgrade-custom-attribute";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {IDestroyable} from "../../destroyable/i-destroyable";
import {construct} from "./construct";

/**
 * Constructs a new ICustomAttribute
 * @param {ICustomAttribute} host
 * @param {Element} hostElement
 * @private
 */
export function ___constructCustomAttribute (host: ICustomAttribute, hostElement: Element): void {
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