import {IHasherService} from "./i-hasher-service";
import {createHmac, getHashes, HexBase64Latin1Encoding} from "crypto";
import {IBuildConfig} from "../../build-config/i-build-config";

// tslint:disable:no-magic-numbers

/**
 * A class that helps with generating hashes
 */
export class HasherService implements IHasherService {

	constructor (private readonly config: IBuildConfig) {}

	/**
	 * The available hashing algorithms
	 * @type {string[]}
	 */
	private static readonly HASH_ALGORITHMS: Set<string> = new Set(getHashes());
	/**
	 * The preferred hashing algorithms to use
	 * @type {Set<string>}
	 */
	private static readonly PREFERRED_HASH_ALGORITHMS: Set<string> = new Set([
		"sha1",
		"sha",
		"md5",
		"md4"
	]);
	/**
	 * The default encoding to use when generating hashes
	 * @type {string}
	 */
	private static readonly DEFAULT_ENCODING: HexBase64Latin1Encoding = "hex";
	/**
	 * Defines the default algorithm to use
	 * @type {string}
	 */
	private static readonly DEFAULT_ALGORITHM: string = (() => {
		for (const algorithm of HasherService.PREFERRED_HASH_ALGORITHMS) {
			if (HasherService.HASH_ALGORITHMS.has(algorithm)) return algorithm;
		}

		// Throw an error if none of the preferred hashing algorithms were available
		throw new ReferenceError(`None of the preferred Hash algorithms were available. All algorithms: ${JSON.stringify(Array.from(HasherService.HASH_ALGORITHMS))} `);
	})();

	/**
	 * Retrieves a random key for an Hmac
	 * @returns {string}
	 */
	private get randomHmacKey (): string {
		return new Date().toISOString();
	}

	/**
	 * Generates a random hash
	 * @param {string} [key]
	 * @returns {string}
	 */
	public generate (key: string = this.randomHmacKey): string {
		return createHmac(HasherService.DEFAULT_ALGORITHM, key)
			.digest(HasherService.DEFAULT_ENCODING);
	}

	/**
	 * Replaces the hash in the given string
	 * @param {string} str
	 * @param {string} hash
	 * @returns {string}
	 */
	public replaceHashInString (str: string, hash: string): string {
		return str.replace(new RegExp(`\\[${this.config.hashName}]`, "g"), hash);
	}

}