import {IEnvPluginOptions} from "./i-env-plugin-options";

// The name of the 'process' library
const PROCESS_MODULE_NAME = "process";

/**
 * A Rollup plugin that generates environment variables that works on runtime
 * @param {IEnvPluginOptions} [options={}]
 */
export function envRollupPlugin (options: Partial<IEnvPluginOptions> = {}) {

	return {
		name: "Environment Rollup Plugin",

		resolveId (id: string): string|void {
			if (id === PROCESS_MODULE_NAME) {
				return PROCESS_MODULE_NAME;
			}
		},

		/**
		 * Checks if the id is "process" and returns custom content if it is
		 * @param {string} id
		 * @returns {string | void}
		 */
		load (id: string): string|void {
			if (id === PROCESS_MODULE_NAME) {
				const result = JSON.stringify(uppercaseKeys({...options.additional, ...process.env}), filterEnvironmentVariables);

				return `
					export const env = ${result};
					export default {env};
				`;
			}
		}

	};
}

/**
 * Filters out any unwanted environment variables from the output
 * @param {string} key
 * @param {string} value
 * @returns {string?}
 */
function filterEnvironmentVariables (key: string, value: string): string|undefined {
	const uppercasedKey = key.toUpperCase();

	if (
		uppercasedKey.startsWith("NPM_PACKAGE_DEVDEPENDENCIES") ||
		uppercasedKey.startsWith("NPM_PACKAGE_DEPENDENCIES") ||
		uppercasedKey.startsWith("NPM_PACKAGE_SCRIPTS") ||
		uppercasedKey.startsWith("NPM_CONFIG")
	) return undefined;

	// Switch through the keys
	switch (uppercasedKey) {
		case "XPC_FLAGS":
		case "TERM_PROGRAM":
		case "TERM_PROGRAM_VERSION":
		case "TERM_SESSION_ID":
		case "DISPLAY":
		case "LC_CTYPE":
		case "LSCOLORS":
		case "PATH":
		case "PAGER":
		case "__CF_USER_TEXT_ENCODING":
		case "SSH_AUTH_SOCK":
		case "USER":
		case "ZSH":
		case "NODE":
		case "INIT_CWD":
		case "SHELL":
		case "TERM":
		case "TMPDIR":
		case "ZDOTDIR":
		case "PWD":
		case "XPC_SERVICE_NAME":
		case "HOME":
		case "SHLVL":
		case "LOGNAME":
		case "LESS":
		case "NPM_PACKAGE_HOMEPAGE":
		case "NPM_EXECPATH":
		case "NPM_PACKAGE_MODULE":
		case "NPM_LIFECYCLE_EVENT":
		case "NPM_PACKAGE_REPOSITORY_TYPE":
		case "NPM_PACKAGE_TYPES":
		case "NPM_PACKAGE_ENGINES_NODE":
		case "NPM_PACKAGE_MAIN":
		case "NPM_PACKAGE_TYPINGS":
		case "NPM_LIFECYCLE_SCRIPT":
		case "NPM_NODE_EXECPATH":
		case "NPM_PACKAGE_ES2015":
		case "_":
		case "NPM_PACKAGE_BROWSER":
		case "NPM_PACKAGE_GITHEAD":
		case "NPM_PACKAGE_PRIVATE":
		case "ROLLUP_WATCH":
		case "VIPSHOME":
		case "OLDPWD":
		case "APPLE_PUBSUB_SOCKET_RENDER":
			return undefined;
		default:
			return value;
	}
}

/**
 * Returns a new object with all of the keys uppercased
 * @param {T} obj
 * @returns {U}
 */
function uppercaseKeys<T extends object, U extends object> (obj: T): U {
	const newObject = <U> {};
	Object.entries(obj).forEach(([key, value]) => {
		newObject[<keyof U> key.toUpperCase()] = value;
	});
	return newObject;
}