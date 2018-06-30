import {runCommand} from "../run-command/run-command";

// tslint:disable:no-any

/**
 * Executes an 'install' instruction inside the given folder
 * @param {string} folder
 * @param {"npm" | "yarn"} packageManager
 * @returns {Promise<Uint8Array>}
 */
export async function install (folder: string, packageManager: "npm"|"yarn" = "npm"): Promise<void> {
	await runCommand(packageManager, ["install"], {cwd: folder, stdio: "ignore"});
}