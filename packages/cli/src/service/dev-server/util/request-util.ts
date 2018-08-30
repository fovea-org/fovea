import {IncomingHttpHeaders} from "http";
import {Request} from "../i-request";
import chalk from "chalk";

const GET_COLOR = chalk.green;
const PUT_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const POST_COLOR = chalk.blue;
const OPTIONS_COLOR = chalk.gray;

/**
 * Splits a header that represents a comma-separated list
 * @param {string} header
 * @returns {Set<string>}
 */
function splitStringifiedListHeader (header: string|string[]): Set<string> {
	const splitted = Array.isArray(header) ? header : header
		.split(",")
		.map(part => part.trim());

	return new Set(splitted);
}

/**
 * Gets an IRequest from the given IncomingHttpHeaders
 * @param {IncomingHttpHeaders} headers
 * @returns {Request}
 */
export function getRequestFromIncomingHeaders (headers: IncomingHttpHeaders): Request {
	return <Request> {
		method: <Request["method"]> headers[":method"]!,
		accept: headers.accept == null
			? undefined
			: splitStringifiedListHeader(headers.accept),
		acceptEncoding: headers["accept-encoding"] == null
			? undefined
			: splitStringifiedListHeader(headers["accept-encoding"]!),
		acceptLanguage: headers["accept-language"] == null
			? undefined
			: splitStringifiedListHeader(headers["accept-language"]!),
		userAgent: headers["user-agent"]!,
		url: new URL(<string> headers[":path"], `${headers[":scheme"]}://${headers[":authority"]}`),
		cachedChecksum: headers["if-none-match"]
	};
}

/**
 * Paints the given method with Chalk. Each method has its' own color
 * @param {string} method
 * @returns {string}
 */
function paintMethod (method: Request["method"]): string {
	switch (method) {
		case "GET": return GET_COLOR(method);
		case "PUT": return PUT_COLOR(method);
		case "POST": return POST_COLOR(method);
		case "DELETE": return DELETE_COLOR(method);
		case "OPTIONS": return OPTIONS_COLOR(method);
	}
}

/**
 * Prints the given request
 * @param {IRequest} request
 */
export function printRequest (request: Request): void {
	console.log(
		`${paintMethod(request.method)} ${request.url.toString()}`
	);
}