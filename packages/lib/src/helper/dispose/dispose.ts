import {FoveaHost} from "@fovea/common";
import {disposeOrDestroyShared} from "./dispose-or-destroy-shared";

/**
 * Invoked when a host is disposed (e.g. the 'disconnectedCallback' is fired)
 * @param {FoveaHost} host
 * @private
 */
export function ___dispose (host: FoveaHost): void {
	disposeOrDestroyShared(host);
	if (host.___disposeTemplates != null) host.___disposeTemplates();
}