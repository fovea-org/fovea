import {Uuid} from "@fovea/common";

/**
 * An auto-incrementing uuid
 * @type {number}
 */
let UUID: Uuid = 0;

/**
 * Increments the UUID and returns the value
 * @returns {Uuid}
 * @private
 */
export function incrementUuid (): Uuid {
	return UUID++;
}