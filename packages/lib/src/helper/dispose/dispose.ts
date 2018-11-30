import {FoveaHost, Json} from "@fovea/common";
import {disposeOrDestroyShared} from "./dispose-or-destroy-shared";

/**
 * Invoked when a host is disposed (e.g. the 'disconnectedCallback' is fired)
 * @param {Json} _host
 * @private
 */
export function ___dispose (_host: Json): void {
	const host = _host as FoveaHost;
	disposeOrDestroyShared(host);
	if (host.___disposeTemplates != null) host.___disposeTemplates();
}