import crossSpawnPromise from "cross-spawn-promise";
import {IRunCommandOptions} from "./i-run-command-options";

// tslint:disable:no-any

/**
 * Formats the 'run command' options
 * @param {string} cwd
 * @param {"inherit" | "ignore" | null} stdio
 * @returns {Partial<crossSpawnPromise.CrossSpawnOptions>}
 */
function formatRunCommandOptions ({cwd, stdio = "inherit"}: Partial<IRunCommandOptions>): Partial<crossSpawnPromise.CrossSpawnOptions> {
	return <any>{
		cwd,
		...(stdio == null ? {} : {stdio})
	};
}

/**
 * Runs a command
 * @param {string} cmd
 * @param {string[]} args
 * @param {Partial<IRunCommandOptions>} [options={}]
 * @returns {Promise<*>}
 */
export async function runCommand (cmd: string, args: string[], options: Partial<IRunCommandOptions> = {}): Promise<any> {
	await crossSpawnPromise(cmd, args, formatRunCommandOptions(options));
}

/**
 * Runs a command and returns the result of running it
 * @param {string} cmd
 * @param {string[]} args
 * @param {Partial<IRunCommandOptions>} options
 * @returns {Promise<string>}
 */
export async function runCommandWithResult (cmd: string, args: string[], options: Partial<IRunCommandOptions> = {}): Promise<string> {
	return (await runCommand(cmd, args, {...options, stdio: null})).toString();
}