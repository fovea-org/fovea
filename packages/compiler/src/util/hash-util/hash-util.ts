import {IHashUtil} from "./i-hash-util";

/**
 * A utility class that can work with hashes
 */
export class HashUtil implements IHashUtil {

	/**
	 * Generates a deterministic hash from the content.
	 * Providing the same content will always generate the same hash
	 * @param {string} content
	 * @returns {string}
	 */
	public generate (content: string): string {
		let hash = 5381;
		const bitSize = 33;
		let i = content.length;

		while (i > 0) {
			hash = (hash * bitSize) ^ content.charCodeAt(--i);
		}

		return `${hash >>> 0}`;
	}

}