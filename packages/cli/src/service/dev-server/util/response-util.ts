import {Http2ServerResponse} from "http2";
import {Response} from "../i-response";

/**
 * Responds to the given Http2Stream with the given response
 * @param {Http2ServerResponse} rawResponse
 * @param {Response} response
 * @returns {void}
 */
export function sendResponse (rawResponse: Http2ServerResponse, response: Response): void {
	if ("contentType" in response && response.contentType != null) {
		rawResponse.setHeader("Content-Type", response.contentType);
	}

	if ("body" in response && response.body != null) {
		rawResponse.setHeader("Content-Length", Buffer.byteLength(response.body));
	}

	if ("cacheControl" in response && response.cacheControl != null) {
		rawResponse.setHeader("Cache-Control", response.cacheControl);
	}

	if ("contentEncoding" in response && response.contentEncoding != null) {
		rawResponse.setHeader("Content-Encoding", response.contentEncoding);
	}

	if ("checksum" in response && response.checksum != null) {
		rawResponse.setHeader("ETag", response.checksum);
	}

	rawResponse.statusCode = response.statusCode;
	rawResponse.end("body" in response ? response.body : undefined);
}