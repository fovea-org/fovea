import {ICustomAttribute, IFoveaHost} from "@fovea/common";

/**
 * Shared logic for when a host is disposed or destroyed
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function disposeOrDestroyShared (host: IFoveaHost|ICustomAttribute): void {
	if (host.___disposeProps != null) host.___disposeProps();
	if (host.___disposeListeners != null) host.___disposeListeners();
	if (host.___disposeVisibilityObservers != null) host.___disposeVisibilityObservers();
	if (host.___disposeCSS != null) host.___disposeCSS();
	if (host.___disposeChildListObservers != null) host.___disposeChildListObservers();
	if (host.___disposeAttributeChangeObservers != null) host.___disposeAttributeChangeObservers();
	if (host.___disposeHostAttributes != null) host.___disposeHostAttributes();
}