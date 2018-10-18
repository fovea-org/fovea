import {ILoggerService} from "./i-logger-service";
import chalk from "chalk";
import ora from "ora";
import {TerminalColor} from "./terminal-color";

// tslint:disable:no-magic-numbers

// tslint:disable:no-any

/**
 * A class that helps with printing relevant information
 */
export class LoggerService implements ILoggerService {

	/**
	 * The color to use for standard output
	 * @type {TerminalColor}
	 */
	public readonly LOG_COLOR: TerminalColor = "magenta";

	/**
	 * The color to use for debug output
	 * @type {TerminalColor}
	 */
	public readonly DEBUG_COLOR: TerminalColor = "yellow";

	/**
	 * The color to use for verbose output
	 * @type {TerminalColor}
	 */
	public readonly VERBOSE_COLOR: TerminalColor = "green";

	/**
	 * The prefix to attach to debugging messages
	 * @type {string}
	 */
	private readonly DEBUG_PREFIX: string = chalk[this.DEBUG_COLOR](this.padPrefix("[DEBUG]"));

	/**
	 * The prefix to attach to verbose messages
	 * @type {string}
	 */
	private readonly VERBOSE_PREFIX: string = chalk[this.VERBOSE_COLOR](this.padPrefix("[VERBOSE]"));

	/**
	 * The prefix to attach to log messages
	 * @type {string}
	 */
	private readonly LOG_PREFIX: string = chalk[this.LOG_COLOR](this.padPrefix("[INFO]"));

	/**
	 * The prefix to attach to log messages related to tags
	 * @type {(tag: string) => string}
	 */
	private readonly TAG_LOG_PREFIX: (tag: string) => string = tag => chalk[this.LOG_COLOR](this.padPrefix(`[${tag}]`));

	/**
	 * The prefix to attach to verbose log messages related to tags
	 * @type {(tag: string) => string}
	 */
	private readonly TAG_VERBOSE_PREFIX: (tag: string) => string = tag => chalk[this.VERBOSE_COLOR](this.padPrefix(`[VERBOSE][${tag}]`));

	/**
	 * The prefix to attach to debug log messages related to tags
	 * @type {(tag: string) => string}
	 */
	private readonly TAG_DEBUG_PREFIX: (tag: string) => string = tag => chalk[this.DEBUG_COLOR](this.padPrefix(`[DEBUG][${tag}]`));

	/**
	 * Create a nice terminal spinner
	 * @type {Ora}
	 */
	private readonly spinner = ora({color: this.LOG_COLOR});

	/**
	 * Whether or not the spinner is currently running
	 * @type {boolean}
	 */
	private spinnerIsRunning: boolean = false;
	/**
	 * Whether or not debugging is currently active
	 * @type {boolean}
	 */
	private _debug: boolean = false;
	/**
	 * Whether or not verbose output is currently active
	 * @type {boolean}
	 */
	private _verbose: boolean = false;

	/**
	 * Sets whether or not debugging is active
	 * @param {boolean} debug
	 */
	public setDebug (debug: boolean): void {
		this._debug = debug;
	}

	/**
	 * Sets whether or not verbose output is active
	 * @param {boolean} verbose
	 */
	public setVerbose (verbose: boolean): void {
		this._verbose = verbose;
	}

	/**
	 * Logs the given message if debugging is activate
	 * @param {T[]} messages
	 * @returns {T}
	 */
	public debug<T> (...messages: T[]): T[] {
		// Print the message if 'debug' is true
		if (this._debug) {
			console.log(this.DEBUG_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages related to the given tag, if debug output is active
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public debugTag<T> (tag: string, ...messages: T[]): T[] {
		// Print the message if 'debug' is true
		if (this._debug) {
			console.log(this.TAG_DEBUG_PREFIX(tag), ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public log<T> (...messages: T[]): T[] {
		if (this._debug) return this.debug(...messages);
		if (this._verbose) return this.verbose(...messages);

		// Print the message
		console.log(this.LOG_PREFIX, ...messages);

		// Return the messages
		return messages;
	}

	/**
	 * Logs a message for the given tag, if given, otherwise it will simply log it
	 * @param {T} message
	 * @param {string} [tag]
	 * @returns {T}
	 */
	public logMessageForTag<T> (message: T, tag?: string): T {
		if (tag == null) return this.log(message)[0];

		if (this._debug) return this.debugTag(tag, message)[0];

		if (this._verbose) return this.verboseTag(tag, message)[0];

		// Print the message
		return this.logTag(tag, message)[0];
	}

	/**
	 * Logs the given messages, if verbose output is active
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public verbose<T> (...messages: T[]): T[] {
		if (this._debug) return this.debug(...messages);

		// Print the message if 'verbose' is true
		if (this._verbose) {
			console.log(this.VERBOSE_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs messages related to the given tag
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public logTag<T> (tag: string, ...messages: T[]): T[] {
		if (this._debug) return this.debugTag(tag, ...messages);
		if (this._verbose) return this.verboseTag(tag, ...messages);

		// Print the message
		console.log(this.TAG_LOG_PREFIX(tag), ...messages);

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages related to the given tag, if verbose output is active
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public verboseTag<T> (tag: string, ...messages: T[]): T[] {
		if (this._debug) return this.debugTag(tag, ...messages);

		// Print the message if 'verbose' is true
		if (this._verbose) {
			console.log(this.TAG_VERBOSE_PREFIX(tag), ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given message with a nice terminal spinner
	 * @param {string} message
	 * @param {TerminalColor} [color]
	 * @returns {string}
	 */
	public logWithSpinner (message: string, color?: TerminalColor): string {
		if (this._debug) return this.debugWithSpinner(message);
		if (this._verbose) return this.verboseWithSpinner(message);

		this.spinner.text = `${this.padPrefix("")}${message}`;
		this.spinner.color = color != null ? color : this.LOG_COLOR;
		if (!this.spinnerIsRunning) {
			this.spinnerIsRunning = true;
			this.spinner.start();
		}
		return message;
	}

	/**
	 * Logs the given message with a nice terminal spinner if debug output is active
	 * @param {string} message
	 * @returns {string}
	 */
	public debugWithSpinner (message: string): string {
		return this._debug ? this.logWithSpinner(message, this.DEBUG_COLOR) : message;
	}

	/**
	 * Logs the given message with a nice terminal spinner if verbose output is active
	 * @param {string} message
	 * @returns {string}
	 */
	public verboseWithSpinner (message: string): string {
		if (this._debug) return this.debugWithSpinner(message);

		return this._verbose ? this.logWithSpinner(message, this.VERBOSE_COLOR) : message;
	}

	/**
	 * Clears the running terminal spinner, if any is running
	 * @param {string} [message]
	 * @returns {string?}
	 */
	public clearSpinner (message?: string): string|undefined {
		this.spinner.stop();
		if (message != null) this.log(message);
		return message;
	}

	/**
	 * Logs the given messages
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public logOnOneLine<T> (...messages: T[]): T[] {
		if (this._debug) return this.debugOnOneLine(...messages);
		if (this._verbose) return this.verboseOnOneLine(...messages);

		// Print the message
		this.printOnOneLine(`${this.LOG_PREFIX} ${messages.join(" ")}`);

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages if 'verbose' is true
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public verboseOnOneLine<T> (...messages: T[]): T[] {
		if (this._debug) return this.debugOnOneLine(...messages);

		if (this._verbose) {
			// Print the message
			this.printOnOneLine(`${this.VERBOSE_PREFIX} ${messages.join(" ")}`);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages if 'debug' is true
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public debugOnOneLine<T> (...messages: T[]): T[] {

		if (this._debug) {
			// Print the message
			this.printOnOneLine(`${this.DEBUG_PREFIX} ${messages.join(" ")}`);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs messages related to the given tag on one line
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public logTagOnOneLine<T> (tag: string, ...messages: T[]): T[] {
		if (this._debug) return this.debugTagOnOneLine(tag, ...messages);
		if (this._verbose) return this.verboseTagOnOneLine(tag, ...messages);

		this.printOnOneLine(`${this.TAG_LOG_PREFIX(tag)} ${messages.join(" ")}`);

		// Return the messages
		return messages;
	}

	/**
	 * Logs messages related to the given tag on one line if 'verbose' is true
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public verboseTagOnOneLine<T> (tag: string, ...messages: T[]): T[] {
		if (this._debug) return this.debugTagOnOneLine(tag, ...messages);

		if (this._verbose) {
			this.printOnOneLine(`${this.TAG_VERBOSE_PREFIX(tag)} ${messages.join(" ")}`);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs messages related to the given tag on one line if 'verbose' is true
	 * @param {string} tag
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public debugTagOnOneLine<T> (tag: string, ...messages: T[]): T[] {

		if (this._debug) {
			this.printOnOneLine(`${this.TAG_DEBUG_PREFIX(tag)} ${messages.join(" ")}`);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Pads a prefix to nicely align text inside the console
	 * @param {string} prefix
	 * @returns {string}
	 */
	private padPrefix (prefix: string): string {
		return prefix.padEnd(20, " ");
	}

	/**
	 * Prints the given output on one line
	 * @param {string} output
	 */
	private printOnOneLine (output: string): void {
		if (process.stdin.isTTY) {
			(<any>process).stdout.clearLine();
			(<any>process).stdout.cursorTo(0);
			if (process.stdout.columns == null || output.length < process.stdout.columns) {
				process.stdout.write(output);
			} else {
				process.stdout.write(output.substring(0, process.stdout.columns - 1));
			}
		} else {
			console.log(output);
		}
	}

	/**
	 * Clears the last line of stdout, if possible
	 */
	public clearLastLine (): void {
		if (process.stdin.isTTY) {
			(<any>process).stdout.clearLine();
			(<any>process).stdout.cursorTo(0);
		}
	}

}