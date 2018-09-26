import {ICustomElement} from "@fovea/common";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {construct} from "./construct";

/**
 * Constructs a new ICustomElement
 * @param {ICustomElement} host
 * @param {Element} [hostElement]
 * @private
 */
export function ___constructCustomElement (host: ICustomElement, hostElement: Element = host): void {

	// Invoke the common construct functionality
	CONSTRUCTED_HOSTS.add(host, construct(host, hostElement));
}