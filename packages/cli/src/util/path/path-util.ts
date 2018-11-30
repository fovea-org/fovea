import {isAbsolute, join, parse, relative, extname} from "path";


/**
 * Strips the extension from a file
 * @param {string} file
 * @returns {string}
 */
export function stripExtension (file: string): string {
	if (extname(file) === "") return file;
	let {dir, name} = parse(file);

	if (name.endsWith(".d")) {
		name = name.slice(0, -2);
	}
	return join(dir, name);
}

/**
 * Sets the given extension for the given file
 * @param {string} file
 * @param {string} extension
 * @returns {string}
 */
export function setExtension (file: string, extension: string): string {
	return `${stripExtension(file)}${extension}`;
}

/**
 * Ensures that the given path is relative
 * @param {string} root
 * @param {string} path
 * @returns {string}
 */
export function ensureRelative (root: string, path: string): string {
	// If the path is already relative, simply return it
	if (!isAbsolute(path)) {
		return path;
	}

	// Otherwise, construct a relative path from the root
	return relative(root, path);
}

/**
 * Ensures that the given path is absolute
 * @param {string} root
 * @param {string} path
 * @returns {string}
 */
export function ensureAbsolute (root: string, path: string): string {
	// If the path is already absolute, simply return it
	if (isAbsolute(path)) {
		return path;
	}

	// Otherwise, construct an absolute path from the root
	return join(root, path);
}