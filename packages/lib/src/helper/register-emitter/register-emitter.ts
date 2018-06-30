import {addEventEmittersForHost} from "../../event/host-event-emitters-for-host/add-event-emitters-for-host";
import {ICustomAttributeConstructor, IEmitBaseOptions, IFoveaHostConstructor} from "@fovea/common";

/*# IF hasEventEmitters */

/**
 * Registers an emitter for the given host and prop
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {string} prop
 * @param {boolean} isStatic
 * @param {Partial<IEventEmitterOptions>} options
 * @private
 */
export function __registerEmitter (host: IFoveaHostConstructor|ICustomAttributeConstructor, prop: string, isStatic: boolean, options?: Partial<IEmitBaseOptions>): void {
	const name = options == null || options.name == null ? `${prop}-changed` : options.name;
	const target = options == null || options.target == null ? undefined : options.target;
	addEventEmittersForHost(host, {name, prop: {name: prop, isStatic}, target});
} /*# END IF hasEventEmitters */