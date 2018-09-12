/**
 * Wipes all content of CacheStorage
 * @returns {Promise<void>}
 */
export async function wipeCaches (): Promise<void> {
	const keys = await caches.keys();
	await Promise.all(keys.map(async key => caches.delete(key)));
}
