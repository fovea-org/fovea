import {CommandBase} from "../command-base";
import {BuildCommandLongOptionKind, BuildCommandShortOptionKind, IBuildCommand, IBuildCommandOptions} from "./i-build-command";
import {ICommandOption} from "../i-command-option";
import {BuildTaskWrapper} from "../../task/build-task/i-build-task";
import {IBuildConfig} from "../../build-config/i-build-config";

/**
 * A command that builds a Fovea app
 */
export class BuildCommand extends CommandBase implements IBuildCommand {

	/**
	 * The command name
	 * @type {string}
	 */
	public readonly shortName: string = "build";
	/**
	 * The rest of the command, following the short name
	 * @type {string?}
	 */
	public readonly command: string|undefined = undefined;
	/**
	 * The description of the command
	 * @type {string}
	 */
	public readonly description: string = "";
	/**
	 * The options that can be provided to the command
	 * @type {ICommandOption[]}
	 */
	public readonly options: ICommandOption[] = [
		{
			shortOption: BuildCommandShortOptionKind.WATCH,
			longOption: BuildCommandLongOptionKind.WATCH,
			description: "Whether to continuously build changed files (useful for development)",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.SERVE,
			longOption: BuildCommandLongOptionKind.SERVE,
			description: "Whether to run a local development server",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.LIVE_RELOAD,
			longOption: BuildCommandLongOptionKind.LIVE_RELOAD,
			description: "Whether to automatically refresh the browser when the bundle(s) change. 'serve' must be true for this option to make any difference",
			defaultValue: true
		},
		{
			shortOption: BuildCommandShortOptionKind.VERBOSE,
			longOption: BuildCommandLongOptionKind.VERBOSE,
			description: "Whether to print verbose output or not",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.DEBUG,
			longOption: BuildCommandLongOptionKind.DEBUG,
			description: "Whether to print debug information to the output or not",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.PRODUCTION,
			longOption: BuildCommandLongOptionKind.PRODUCTION,
			description: "Whether to build for production or not",
			defaultValue: this.config.production
		},
		{
			shortOption: BuildCommandShortOptionKind.NO_CACHE,
			longOption: BuildCommandLongOptionKind.NO_CACHE,
			description: "Whether to skip the cache or not",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.STATS,
			longOption: BuildCommandLongOptionKind.STATS,
			description: "Whether to also generate stats and write them to a JSON file",
			defaultValue: false
		},
		{
			shortOption: BuildCommandShortOptionKind.CONFIG,
			longOption: `${BuildCommandLongOptionKind.CONFIG} [path]`,
			description: "The paths to the Fovea CLI configuration file for the project",
			defaultValue: `${this.config.foveaCliConfigName}.${this.config.defaultScriptExtension}`
		}
	];

	constructor (private readonly config: IBuildConfig,
							 private readonly buildTaskWrapper: BuildTaskWrapper) {
		super();
	}

	/**
	 * Invoked when a command is received with options
	 * @param {string[]} _args
	 * @param {IBuildCommandOptions} options
	 * @returns {Promise<void>}
	 */
	public async onCommand (_args: string[], options: IBuildCommandOptions): Promise<void> {
		await this.buildTaskWrapper().execute(options);
	}
}