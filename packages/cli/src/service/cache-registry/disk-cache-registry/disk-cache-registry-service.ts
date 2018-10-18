import {IDiskCacheRegistryService} from "./i-disk-cache-registry-service";
import {ICacheRegistryCacheOptions, ICacheRegistryGetOptionsMap} from "../i-cache-registry-get-options";
import {ICacheRegistryGetResult} from "../i-cache-registry-get-result";
import {CacheEntryKind} from "../cache-entry-kind";
import {join} from "path";
import {ILoggerService} from "../../logger/i-logger-service";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IHasherService} from "../../hasher/i-hasher-service";
import {IBufferSerializer} from "../../../buffer-serializer/i-buffer-serializer";
import {IFileSaver} from "@wessberg/filesaver";
import {IFileLoader} from "@wessberg/fileloader";
import {IChecksumCacheMap} from "./i-checksum-cache-map";
import {createHash} from "crypto";
import {BuildError} from "../../../error/build-error/build-error";

/**
 * A cache registry that writes to and reads from disk
 */
export class DiskCacheRegistryService implements IDiskCacheRegistryService {

	/**
	 * The name of the file that contains a map between CacheActions and the latest seen MD5 checksums
	 * @type {string}
	 */
	private readonly CHECKSUM_CACHE_MAP_FILENAME: string = "__checksum_cache__";

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly fileSaver: IFileSaver,
							 private readonly bufferSerializer: IBufferSerializer,
							 private readonly hasher: IHasherService,
							 private readonly config: IBuildConfig,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Gets an item from the disk cache, if any exists
	 * @template T
	 * @param {T} kind
	 * @param {ICacheRegistryGetOptionsMap[T]} options
	 * @returns {Promise<ICacheRegistryGetResult|undefined>}
	 */
	public async get<T extends CacheEntryKind> (kind: T, options: ICacheRegistryGetOptionsMap[T]): Promise<ICacheRegistryGetResult[T]|undefined> {
		const cacheIdentifier = this.getCacheIdentifier(kind, options.entryKindOptions);
		const cacheFilePath = this.getPathToCacheFile(options.cacheOptions.root, cacheIdentifier);

		// Return undefined if the file doesn't exist
		if (!(await this.fileLoader.exists(cacheFilePath))) {
			return undefined;
		}

		// Otherwise retrieve it from the cache
		this.logger.debug(`Fetching '${cacheIdentifier}' from cache for CacheEntryKind: ${CacheEntryKind[kind]}`);

		// Read the file and convert it into a native representation
		return this.bufferSerializer.fromBuffer<ICacheRegistryGetResult[T]>(await this.fileLoader.load(cacheFilePath));
	}

	/**
	 * Sets something within the cache
	 * @template T
	 * @param {T} kind
	 * @param {options: ICacheRegistryGetOptionsMap[T]} options
	 * @param {ICacheRegistryGetResult[T]} payload
	 * @returns {Promise<void>}
	 */
	public async set<T extends CacheEntryKind> (kind: T, options: ICacheRegistryGetOptionsMap[T], payload: ICacheRegistryGetResult[T]): Promise<void> {
		const cacheIdentifier = this.getCacheIdentifier(kind, options.entryKindOptions);
		const cacheFilePath = this.getPathToCacheFile(options.cacheOptions.root, cacheIdentifier);

		// Lazily write to the cache
		this.logger.debug(`Storing'${cacheIdentifier}' inside cache for CacheEntryKind: ${CacheEntryKind[kind]}`);
		await Promise.all([
			this.fileSaver.save(cacheFilePath, this.bufferSerializer.toBuffer(payload)),
			this.addToChecksumCacheMap(cacheIdentifier, await this.getChecksum(kind, options.entryKindOptions), options.cacheOptions)
		]);
	}

	/**
	 * Gets the checksum for a specific kind with the given options
	 * @template T
	 * @param {T} kind
	 * @param {ICacheRegistryGetOptionsMap[T]["entryKindOptions"]} options
	 * @returns {Promise<string>}
	 */
	public async getChecksum<T extends CacheEntryKind> (kind: T, options: ICacheRegistryGetOptionsMap[T]["entryKindOptions"]): Promise<string> {

		switch (kind) {
			case CacheEntryKind.OPTIMIZED_ASSET_BUFFERS:
				// First, compute a checksum for all of the files
				const fileChecksum = await this.fileLoader.getChecksum(options.options.assetDir);
				// Compute and return a checksum from the options, combined with the checksum for the files
				return this.getHashFromContent(
					`${JSON.stringify(options)}${fileChecksum}`
				);

			default:
				throw new BuildError({
					message: `Unknown kind: ${CacheEntryKind[kind]}`,
					fatal: true
				});
		}
	}

	/**
	 * Gets the identifier for a specific kind with the given options within the cache
	 * @template T
	 * @param {T} kind
	 * @param {ICacheRegistryGetOptionsMap[T]} _options
	 * @returns {string}
	 */
	public getCacheIdentifier<T extends CacheEntryKind> (kind: T, _options: ICacheRegistryGetOptionsMap[T]["entryKindOptions"]): string {

		switch (kind) {
			case CacheEntryKind.OPTIMIZED_ASSET_BUFFERS:
				return this.getHashFromContent(`[${kind}]}`);

			default:
				throw new BuildError({
					message: `Unknown kind: ${CacheEntryKind[kind]}`,
					fatal: true
				});
		}
	}

	/**
	 * Returns true if the cache needs to be updated
	 * @template T
	 * @param {T} kind
	 * @param {ICacheRegistryGetOptionsMap[T]} options
	 * @returns {Promise<boolean>}
	 */
	public async cacheNeedsUpdate<T extends CacheEntryKind> (kind: T, {entryKindOptions, cacheOptions}: ICacheRegistryGetOptionsMap[T]): Promise<boolean> {

		// If the cache should be skipped, always update the cache
		if (cacheOptions.skip) return true;

		// If the cache map doesn't even exist, the cache definitely needs an update
		if (!(await this.fileLoader.exists(this.getPathToCacheFile(cacheOptions.root, this.CHECKSUM_CACHE_MAP_FILENAME)))) return true;

		// Take the checksum cache map from disk
		const cacheMap = await this.getChecksumCacheMap(cacheOptions);

		// Take the value matching the action from the cache map
		const existingChecksum = cacheMap[this.getCacheIdentifier(kind, entryKindOptions)];

		// If it doesn't exist, the cache needs an update
		if (existingChecksum == null) return true;

		// Otherwise, if the checksum doesn't match the checksum from the cache, return false
		return existingChecksum !== await this.getChecksum(kind, entryKindOptions);
	}

	/**
	 * Gets the checksum cache map from disk
	 * @param {ICacheRegistryCacheOptions} cacheOptions
	 * @returns {Promise<IChecksumCacheMap>}
	 */
	private async getChecksumCacheMap (cacheOptions: ICacheRegistryCacheOptions): Promise<IChecksumCacheMap> {
		const checksumCacheMapPath = this.getPathToCacheFile(cacheOptions.root, this.CHECKSUM_CACHE_MAP_FILENAME);

		// If the file already exists, parse and return it from disk
		if (await this.fileLoader.exists(checksumCacheMapPath)) {
			try {
				return this.bufferSerializer.fromBuffer<IChecksumCacheMap>(await this.fileLoader.load(checksumCacheMapPath));
			} catch {
				// If the cache map has been invalidated, remove it all-together and invoke the method again
				await this.fileSaver.remove(checksumCacheMapPath);
				return await this.getChecksumCacheMap(cacheOptions);
			}
		}

		// Otherwise, create it
		else {
			const content = {};
			await this.fileSaver.save(checksumCacheMapPath, this.bufferSerializer.toBuffer(content));
			return content;
		}
	}

	/**
	 * Adds the given checksum for the given action to the checksum cache map
	 * @param {string} identifier
	 * @param {string} checksum
	 * @param {ICacheRegistryCacheOptions} cacheOptions
	 * @returns {Promise<void>}
	 */
	private async addToChecksumCacheMap (identifier: string, checksum: string, cacheOptions: ICacheRegistryCacheOptions): Promise<void> {
		const checksumCacheMapPath = this.getPathToCacheFile(cacheOptions.root, this.CHECKSUM_CACHE_MAP_FILENAME);

		// Blend the new one with the existing map and save it to disk
		await this.fileSaver.save(checksumCacheMapPath, this.bufferSerializer.toBuffer({
			...(await this.getChecksumCacheMap(cacheOptions)),
			[identifier]: checksum
		}));
	}

	/**
	 * Gets the path to the cache entry for an action
	 * @param {string} root
	 * @param {string[]} path
	 * @returns {string}
	 */
	private getPathToCacheFile (root: string, ...path: string[]): string {
		return join(this.config.cacheRoot, this.hasher.generate(root), ...path);
	}

	/**
	 * Generates a hash from the given content
	 * @param content
	 */
	private getHashFromContent (content: string): string {
		const shasum = createHash("sha1");
		shasum.update(content);
		return shasum.digest("hex");
	}

}