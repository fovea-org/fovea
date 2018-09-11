/**
 * Waits the given amount of time before resolving the Promise
 * @param {number} ms
 * @returns {Promise<void>}
 */
export async function wait (ms: number = 0): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}