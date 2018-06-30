import {CommandBase} from "../command-base";
import {CreateCommandLongOptionKind, CreateCommandShortOptionKind, ICreateCommand, ICreateCommandOptions} from "./i-create-command";
import {ICommandOption} from "../i-command-option";
import {CreateTaskWrapper} from "../../task/create-task/i-create-task";

/**
 * A command that creates a new Fovea app
 */
export class CreateCommand extends CommandBase implements ICreateCommand {

	/**
	 * The command name
	 * @type {string}
	 */
	public readonly shortName: string = "create";
	/**
	 * The rest of the command, following the short name
	 * @type {string}
	 */
	public readonly command: string = "[name]";
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
			shortOption: CreateCommandShortOptionKind.VERBOSE,
			longOption: CreateCommandLongOptionKind.VERBOSE,
			description: "Whether to print verbose output or not",
			defaultValue: false
		},
		{
			shortOption: CreateCommandShortOptionKind.DEBUG,
			longOption: CreateCommandLongOptionKind.DEBUG,
			description: "Whether to print debug information to the output or not",
			defaultValue: false
		},
		{
			shortOption: CreateCommandShortOptionKind.INSTALL,
			longOption: CreateCommandLongOptionKind.INSTALL,
			description: "Whether to install dependencies after generating the new project",
			defaultValue: true
		},
		{
			shortOption: CreateCommandShortOptionKind.YARN,
			longOption: CreateCommandLongOptionKind.YARN,
			description: "Whether to use Yarn as the package manager of choice",
			defaultValue: false
		},
		{
			shortOption: CreateCommandShortOptionKind.TEMPLATE,
			longOption: `${CreateCommandLongOptionKind.TEMPLATE} [kind]`,
			description: "Which template to use for the created project",
			defaultValue: "standard"
		}
	];

	constructor (private readonly createTaskWrapper: CreateTaskWrapper) {
		super();
	}

	/**
	 * Invoked when a command is received with options
	 * @param {string[]} args
	 * @param {ICreateCommandOptions} options
	 * @returns {Promise<void>}
	 */
	public async onCommand (args: string[], options: ICreateCommandOptions): Promise<void> {
		const [folder] = args;

		await this.createTaskWrapper().execute({folder, ...options});
	}
}