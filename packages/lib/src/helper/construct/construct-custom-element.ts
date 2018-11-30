import {ICustomElement, Json} from "@fovea/common";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {construct} from "./construct";

/**
 * Constructs a new ICustomElement
 * @param {Json} _host
 * @param {Element} [hostElement]
 * @private
 */
export function ___constructCustomElement (_host: Json, hostElement: Element = _host): void {
	const host = _host as ICustomElement;

	// Invoke the common construct functionality
	CONSTRUCTED_HOSTS.add(host, construct(host, hostElement));
}