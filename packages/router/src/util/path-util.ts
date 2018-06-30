/**
 * Ensures that the given path starts with a leading slash
 * @param path
 */
export function ensureLeadingSlash (path: string): string {
	return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Ensures that the given path doesn't start with a leading slash
 * @param path
 */
export function ensureNoLeadingSlash (path: string): string {
	return path.startsWith("/") ? path.slice(1) : path;
}

/**
 * Ensures that the given path ends with a trailing slash
 * @param path
 */
export function ensureTrailingSlash (path: string): string {
	return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Ensures that the given path doesn't end with a trailing slash
 * @param path
 */
export function ensureNoTrailingSlash (path: string): string {
	return path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Ensures that the given path has a leading, but no trailing slash
 * @param {string} path
 */
export function ensureLeadingButNoTrailingSlash (path: string): string {
	if (path === "/" || path === "") return "";
	return ensureLeadingSlash(ensureNoTrailingSlash(path));
}