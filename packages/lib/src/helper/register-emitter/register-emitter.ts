import {addEventEmittersForHost} from "../../event/host-event-emitters-for-host/add-event-emitters-for-host";
import {FoveaHostConstructor, IEmitBaseOptions, Json} from "@fovea/common";

/**
 * Registers an emitter for the given host and prop
 * @param {Json} _host
 * @param {string} prop
 * @param {boolean} isStatic
 * @param {Partial<IEventEmitterOptions>} options
 * @private
 */
export function ___registerEmitter (_host: Json, prop: string, isStatic: boolean, options?: Partial<IEmitBaseOptions>): void {
	const host = _host as FoveaHostConstructor;
	const name = options == null || options.name == null ? `${prop}-changed` : options.name;
	const target = options == null || options.target == null ? undefined : options.target;
	addEventEmittersForHost(host, {name, prop: {name: prop, isStatic}, target});
}