import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {CHANGE_OBSERVERS_FOR_HOST} from "./change-observers-for-host";
import {IChangeObserver} from "../i-change-observer";

/**
 * Maps the given change observer(s) to the host, indicating that their contained methods should be invoked when any of the contained props change
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {IChangeObserver[]|IChangeObserver} changeObserver
 */
export function addChangeObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, changeObserver: IChangeObserver[]|IChangeObserver): void {
	// Add the change observer(s) to the array of change observers for the host
	CHANGE_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(changeObserver) ? changeObserver : [changeObserver]));
}