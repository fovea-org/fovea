// tslint:disable:no-any

import {IBuildErrorOptions} from "./i-build-error-options";

/**
 * A BuildError is a form of error that can report whether or not errors are fatal, as well as relevant associated data
 */
export class BuildError<T> extends Error {
	/**
	 * The data the BuildError wraps, if any
	 * @template T
	 * @type {T}
	 */
	public readonly data?: T;

	/**
	 * Whether or not the error is fatal
	 * @type {boolean}
	 */
	public readonly fatal: boolean;

	/**
	 * The build tag in which the Error occurred
	 * @type {string}
	 */
	public readonly tag?: string;

	constructor (options: IBuildErrorOptions<T>) {
		super(options.message);
		this.fatal = options.fatal;
		this.data = options.data;
		this.tag = options.tag;
		Error.captureStackTrace(this, BuildError);
	}
}