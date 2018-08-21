import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {disposeOrDestroyShared} from "./dispose-or-destroy-shared";

/**
 * Invoked when a host is disposed (e.g. the 'disconnectedCallback' is fired)
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function ___dispose (host: IFoveaHost|ICustomAttribute): void {
	disposeOrDestroyShared(host);
	if (host.___disposeTemplates != null) host.___disposeTemplates();
}