import {IEmitEventOptions} from "./event-emitter/i-emit-event-options";

/**
 * Emits an event on the given target with the detail equal to the provided value
 * @param {*} value
 * @param {EventTarget} target
 * @param {string} name
 */
export function emitEvent ({value, target, name}: IEmitEventOptions): void {
	const event = new CustomEvent(name, {detail: value});
	target.dispatchEvent(event);
}