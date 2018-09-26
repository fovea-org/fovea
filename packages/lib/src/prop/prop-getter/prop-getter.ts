import {AnyHost} from "../../host/any-host/any-host";

// tslint:disable:no-any

/**
 * This function is invoked when a value is attempted to be gotten from any host
 * @param {AnyHost} host
 * @param {string} name
 * @returns {*}
 */
export function propGetter (host: AnyHost, name: string): any {
	return (<any>host)[`_${name}`];
}