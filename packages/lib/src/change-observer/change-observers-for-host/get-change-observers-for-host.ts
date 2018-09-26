import {FoveaHostConstructor, IHostProp} from "@fovea/common";
import {IChangeObserver} from "../i-change-observer";
import {CHANGE_OBSERVERS_FOR_HOST} from "./change-observers-for-host";

/**
 * Gets all ChangeObservers for the given host and prop
 * @param {FoveaHostConstructor} host
 * @param {IHostProp} prop
 * @returns {IChangeObserver[]}
 */
export function getChangeObserversForHost (host: FoveaHostConstructor, prop: IHostProp): IChangeObserver[] {

	// Take all IChangeObservers that references the provided prop
	return CHANGE_OBSERVERS_FOR_HOST.filterValues(host, changeObserver => changeObserver.props.some(propName => propName === prop.name));
}