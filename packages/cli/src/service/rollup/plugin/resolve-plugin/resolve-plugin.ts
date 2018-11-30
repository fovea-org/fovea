import {IResolvePluginOptions} from "./i-resolve-plugin-options";
import {sync} from "resolve";
import {isAbsolute} from "path";
import {IPackageJson, PackageJsonMainField} from "../../../../package-json/i-package-json";

/**
 * A map between id's and their results from previous resolving
 * @type {Map<string, string|undefined>}
 */
const cache: Map<string, string|null> = new Map();

/**
 * A Rollup plugin that can resolve paths within node_modules using the node resolution algorithm
 * @param {IResolvePluginOptions} [options={}]
 */
export function resolvePlugin ({
																		 cwd = process.cwd(),
																		 prioritizedPackageKeys = ["module", "es2015", "jsnext:main", "main"],
																		 prioritizedExtensions = [".js", ".mjs", ".jsx", ".ts", ".tsx", ".json"],
																		 selectPackageField,
																		 moduleDirectory = "node_modules"
																	 }: Partial<IResolvePluginOptions> = {}) {

	return {
		name: "Resolve Rollup Plugin",

		/**
		 * Attempts to resolve the given id within node_modules and returns void if it fails to do so
		 * @param {string} id
		 * @returns {string | void}
		 */
		resolveId (id: string): string|void {

			// If the given id is already an absolute path, it is resolved already
			if (isAbsolute(id)) return;

			// Attempt to take the resolve result from the cache
			const cacheResult = cache.get(id);

			// If it is a proper path, return it
			if (cacheResult != null) return cacheResult;

			// Otherwise, if the cache result isn't strictly equal to 'undefined', it has previously been resolved to a non-existing file
			if (cacheResult === null) return;

			// Otherwise, try to resolve it and put it in the cache
			try {
				const resolveResult = sync(id, {
					basedir: cwd,
					extensions: prioritizedExtensions,
					moduleDirectory,
					packageFilter (pkg: IPackageJson): IPackageJson {
						let property: PackageJsonMainField|undefined|null|void;
						// If a 'selectPackageField' callback is given, let it decide which package property to use
						if (selectPackageField != null) {
							property = selectPackageField(pkg);
						}

						//  Otherwise, or if no key was selected, use the prioritized list of fields and take the first matched one
						if (property == null) {
							const packageKeys = Object.keys(pkg);
							property = prioritizedPackageKeys.find(key => packageKeys.includes(key));
						}

						// If a property was resolved, set the 'main' property to it (resolve will use the main property no matter what)
						if (property != null) {
							pkg.main = pkg[property];
						}

						// Return the package
						return pkg;
					}
				});

				// Add it to the cache
				cache.set(id, resolveResult);

				// Return it
				return resolveResult;

			} catch (ex) {
				// No file could be resolved. Set it in the cache as unresolvable and return void
				cache.set(id, null);
				// Return void
			}
		}
	};
}