import {IRequestHandler} from "./i-request-handler";
import {Response} from "../i-response";
import {printRequest} from "../util/request-util";
import {IFileLoader} from "@wessberg/fileloader";
import {join, extname} from "path";
import FileType from "file-type";
import {getType} from "mime";
import {IGetRequestHandlerOptions, RequestHandlerOptions} from "./request-handler-options";
import {constants} from "http2";
import {EncodingKind} from "../encoding/encoding-kind";
import {EncodingExtensionKind} from "../encoding/encoding-extension-kind";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";
import {LoadedResource} from "../loaded-resource";
import {ILoggerService} from "../../logger/i-logger-service";
import {IGetFilepathWithEncodingResult} from "../i-get-filepath-with-encoding-result";
import {Buffer} from "buffer";
import {LIVE_RELOAD_INJECTION} from "../live-reload/injection";
import {ContentType} from "../content-type/content-type";

/**
 * A handler that can handle requests
 */
export class RequestHandler implements IRequestHandler {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly logger: ILoggerService) {
	}

	/**
	 * Handles the given request
	 * @param {RequestHandlerOptions} options
	 * @returns {Promise<Response>}
	 */
	public async handle (options: RequestHandlerOptions): Promise<Response> {
		// Print the request if the LogLevel permits it
		if (options.serverOptions.logLevel > 1) {
			printRequest(options.request);
		}

		switch (options.request.method) {
			case "GET":
				return await this.handleGetRequest(<IGetRequestHandlerOptions> options);

			default:
				return {
					body: `Only GET requests are supported for the Development Server`,
					statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
					contentType: ContentType.TEXT_PLAIN
				};
		}
	}

	/**
	 * Handles the given GET request
	 * @param {IGetRequestHandlerOptions} options
	 * @returns {Promise<Response>}
	 */
	private async handleGetRequest (options: IGetRequestHandlerOptions): Promise<Response> {
		// Resolve the requested resource
		const resource = await this.loadResource(options);
		let response: Response;

		if (resource == null) {

			// Return a 404 request
			response = {
				body: `No resource exists at '${options.request.url.pathname}'`,
				statusCode: constants.HTTP_STATUS_NOT_FOUND,
				contentType: ContentType.TEXT_PLAIN
			};
		}

		else {
			if ("buffer" in resource) {
				// Return a 200!
				response = {
					body: resource.buffer,
					statusCode: constants.HTTP_STATUS_OK,
					contentType: resource.contentType,
					cacheControl: options.serverOptions.cacheControl,
					contentEncoding: resource.contentEncoding,
					checksum: resource.checksum
				};
			}

			// Return a 304!
			else {
				response = {
					statusCode: constants.HTTP_STATUS_NOT_MODIFIED,
					cacheControl: options.serverOptions.cacheControl
				};
			}
		}

		// Inform the outside world that the response is ready. The outside world may potentially alter the response
		options.onResponseReady(options.request, response, options.serverOptions.root);

		// Return the response
		return response;
	}

	/**
	 * Loads the index file
	 * @param options
	 */
	private async loadIndex (options: RequestHandlerOptions): Promise<LoadedResource|undefined> {
		let normalizedPath;

		// Try to resolve the path from the hook
		const requestIndexResult = options.onRequestIndex(options.request.userAgent, options.serverOptions.root);

		// If no index was matched by any bundle
		if (requestIndexResult == null) {

			// Fall back to the fallback name
			const fallbackName = typeof options.fallbackIndex === "function"
				? options.fallbackIndex()
				: options.fallbackIndex;
			this.logger.debug(`index.html wasn't matched by a bundle. Falling back to: '${fallbackName.path}'`);
			normalizedPath = fallbackName.path;
		}

		// Otherwise, set the path
		else {
			normalizedPath = requestIndexResult.path;
		}

		// Load it
		return await this.loadResourceFromNormalizedPath(options, true, normalizedPath);
	}

	/**
	 * Loads a resource after a normalized path has been computed
	 * @param {RequestHandlerOptions} options
	 * @param {boolean} isIndex
	 * @param {string} normalizedPath
	 */
	private async loadResourceFromNormalizedPath (options: RequestHandlerOptions, isIndex: boolean, normalizedPath: string): Promise<LoadedResource|undefined> {
		// Define an absolute path to the resource
		const absolutePath = join(options.serverOptions.root, normalizedPath);

		// Resolve the file, including encoding
		const pathResult = await this.getFilePathWithEncoding(
			absolutePath,
			// If the index is requested and liveReload is active, don't return an encoded file since we can't
			// append the live reload content to a Brotli or Zlib encoded file
			isIndex && options.serverOptions.liveReload.activated
				? undefined
				: options.request.acceptEncoding
		);
		if (pathResult == null) return undefined;

		// If the ETag (cachedChecksum) matches the checksum of the file, signal that to the client
		if (options.request.cachedChecksum != null && pathResult.checksum === options.request.cachedChecksum) {
			return {
				path: pathResult.path
			};
		}

		// Otherwise, load the file
		const originalBuffer = await this.loadFile(absolutePath);
		let encodedBuffer = pathResult.path === absolutePath ? originalBuffer! : await this.fileLoader.load(pathResult.path);

		// Inject the live reload content within the index
		if (options.serverOptions.liveReload.activated && isIndex) {

			// Add the live reload content to the Buffer
			encodedBuffer = Buffer.concat([encodedBuffer, Buffer.from(LIVE_RELOAD_INJECTION(options.serverOptions.liveReload.path, options.websocketPort))]);
		}

		// Return the options
		return {
			buffer: encodedBuffer,
			path: pathResult.path,
			contentType: this.guessFileType(originalBuffer, normalizedPath),
			contentEncoding: pathResult.encoding,
			checksum: pathResult.checksum
		};
	}

	/**
	 * Attempts to load a resource and may return undefined if it didn't succeed
	 * @param {RequestHandlerOptions} options
	 * @returns {Promise<LoadedResource | undefined>}
	 */
	private async loadResource (options: RequestHandlerOptions): Promise<LoadedResource|undefined> {
		const path: string = options.request.url.pathname;
		const isIndex = path === "/";

		// If the index is requested, try to resolve it
		if (isIndex) {
			return await this.loadIndex(options);
		}

		// Otherwise, attempt to resolve it as a static file
 		const result = await this.loadResourceFromNormalizedPath(options, false, path);

		// If the result was given, return it
		if (result != null) return result;

		// Otherwise, return undefined if it has a file extension, in which case a 404 will be returned.
		// If it doesn't have a file extension, treat this as a path and return the index file instead
		else {
			if (extname(path) === "") {
				return await this.loadIndex(options);
			}
			return undefined;
		}
	}

	/**
	 * Gets the file path to a file, including encoding
	 * @param {string} path
	 * @param {Set<string>} acceptEncoding
	 * @returns {Promise<IGetFilepathWithEncodingResult | undefined>}
	 */
	private async getFilePathWithEncoding (path: string, acceptEncoding?: Set<string>): Promise<IGetFilepathWithEncodingResult|undefined> {
		let normalizedPath: string|undefined;

		if (acceptEncoding != null && acceptEncoding.has(EncodingKind.BROTLI)) {
			normalizedPath = `${path}${EncodingExtensionKind.BROTLI}`;
			if (await this.fileLoader.exists(normalizedPath)) {
				return {
					path: normalizedPath,
					encoding: ContentEncodingKind.BROTLI,
					checksum: await this.fileLoader.getChecksum(normalizedPath)
				};
			}
		}

		if (acceptEncoding != null && acceptEncoding.has(EncodingKind.GZIP)) {
			normalizedPath = `${path}${EncodingExtensionKind.GZIP}`;
			if (await this.fileLoader.exists(normalizedPath)) {
				return {
					path: normalizedPath,
					encoding: ContentEncodingKind.GZIP,
					checksum: await this.fileLoader.getChecksum(normalizedPath)
				};
			}
		}

		if (await this.fileLoader.exists(path)) {
			return {
				path,
				encoding: undefined,
				checksum: await this.fileLoader.getChecksum(path)
			};
		}

		return undefined;
	}

	/**
	 * Loads a given file or returns undefined if it doesn't exist
	 * @param {string} path
	 * @returns {Promise<Buffer | undefined>}
	 */
	private async loadFile (path: string): Promise<Buffer|undefined> {
		try {
			return await this.fileLoader.load(path);
		}
		catch {
			return undefined;
		}
	}

	/**
	 * Guesses the type of a file based on its' contents or its' path if all else fails
	 * @param {Buffer?} buffer
	 * @param {string} path
	 * @returns {string}
	 */
	private guessFileType (buffer: Buffer|undefined, path: string): string {
		// Attempt to read the file type from the Buffer
		const readFileType = buffer == null ? null : FileType(buffer);

		// If it is defined, return its' mime type
		if (readFileType != null) return readFileType.mime;

		// Otherwise, guess it from the filename
		const assumedFileType = getType(path);

		// If we have a guess, return its' mime type
		if (assumedFileType != null) return assumedFileType;

		// Otherwise, fall back to text/plain
		return ContentType.TEXT_PLAIN;
	}

}