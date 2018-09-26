import {IDevServerService} from "./i-dev-server-service";
import {createSecureServer, Http2SecureServer, Http2ServerRequest, Http2ServerResponse} from "http2";
import {createServer, Server as HttpServer} from "http";
import {createServer as createHttpsServer} from "https";
import {createConnection, createServer as createTCPServer, Server as TCPServer} from "net";
import {certificateFor, hasCertificateFor} from "devcert";
import {IRequestHandler} from "./request-handler/i-request-handler";
import {getRequestFromIncomingHeaders} from "./util/request-util";
import {sendResponse} from "./util/response-util";
import {IDevServerServiceServeOptions} from "./i-dev-server-service-serve-options";
import {RequestIndexSubscriber} from "./request-index-subscriber";
import {ILoggerService} from "../logger/i-logger-service";
import {IServerSet} from "./i-server-set";
import {ResponseReadySubscriber} from "./response-ready-subscriber";
import {EmptyResult} from "./empty-result";
import {IRequestIndexSubscriberResult} from "./i-request-index-subscriber-result";
import {IRequestHandlerOptions, RequestHandlerOptions} from "./request-handler/request-handler-options";
import * as WebSocket from "ws";
import {IDevServerServeResult} from "./i-dev-server-serve-result";

/**
 * A class that can generate a HTTP2 development server with support for Gzip and Brotli compression
 */
export class DevServerService implements IDevServerService {
	/**
	 * A TLS handshake record starts with byte 22.
	 * @type {number}
	 */
	private readonly TLS_HANDSHAKE_RECORD_BYTE: number = 22;

	/**
	 * The HTTP status code for redirecting
	 * @type {number}
	 */
	private readonly HTTP_REDIRECT_STATUS_CODE: number = 301;

	/**
	 * A map between hosts and the underlying HttpServers and HTTP2SecureServers being used to host and listen on them
	 * @type {Map<string, IServerSet>}
	 */
	private readonly serverMap: Map<string, IServerSet> = new Map();
	/**
	 * Gets the Set of all currently active serve options
	 * @type {Set<IDevServerServiceServeOptions>}
	 */
	private readonly activeOptions: Set<IDevServerServiceServeOptions> = new Set();
	/**
	 * All the subscriber callbacks to invoke when the index is requested.
	 * These may optionally return a specific index.html file to resolve
	 * @type {RequestIndexSubscriber[]}
	 */
	private readonly onRequestIndexSubscribers: RequestIndexSubscriber[] = [];
	/**
	 * All the subscriber callbacks to invoke when the response headers has been set and the response is about to be sent.
	 * These may be useful for setting additional headers or manipulating existing ones
	 * @type {Set<RequestIndexSubscriber>}
	 */
	private readonly onResponseReadySubscribers: Set<ResponseReadySubscriber> = new Set();

	constructor (private readonly logger: ILoggerService,
							 private readonly requestHandler: IRequestHandler) {
	}

	/**
	 * Adds a subscriber callback to invoke when the index is requested.
	 * This may optionally return a specific index.html file to resolve
	 * @param {number} index
	 * @param {RequestIndexSubscriber} callback
	 */
	public onRequestIndex (index: number, callback: RequestIndexSubscriber): void {
		this.onRequestIndexSubscribers[index] = (callback);
	}

	/**
	 * Adds a subscriber callback to invoke when response headers has been set and
	 * a response is about to be sent to the client
	 * @param {ResponseReadySubscriber} callback
	 */
	public onResponseReady (callback: ResponseReadySubscriber): void {
		this.onResponseReadySubscribers.add(callback);
	}

	/**
	 * Gets all currently active options
	 * @returns {Set<IDevServerServiceServeOptions>}
	 */
	public getActiveOptions (): Set<IDevServerServiceServeOptions> {
		return this.activeOptions;
	}

	/**
	 * Starts a new HTTP2 server and listens on the given port
	 * @param {IDevServerServiceServeOptions} options
	 * @returns {Promise<IDevServerServeResult>}
	 */
	public async serve (options: IDevServerServiceServeOptions): Promise<IDevServerServeResult> {

		// Stop any already running server that matches the given options
		await this.stopServerSetForOptions(options);

		const httpPort = options.port + 1;
		const httpsPort = options.port + 2;
		const websocketPort = options.port + 3;

		// Create a TCP Server that serves as a proxy to mimic HTTP and HTTPS running on the same port
		const tcpServer = createTCPServer(connection => {
			// Catch TCP errors to keep the connection alive
			connection.on("error", () => {
			});

			connection.once("data", (buf) => {
				const address = (buf[0] === this.TLS_HANDSHAKE_RECORD_BYTE)
					? httpsPort
					: httpPort;

				// Create the proxy
				const proxy = createConnection(`${address}`, () => {
					proxy.write(buf);
					connection
						.pipe(proxy)
						.pipe(connection);
				});
			});
		});

		// Generate the certificates to use for local debugging
		if (!hasCertificateFor(options.host)) {
			this.logger.log(`A certificate will be generated for running a secure server locally. You will be prompted to enter your password`);
		}
		const certificates = await certificateFor(options.host);

		const websocketHttpsServer = options.liveReload.activated ? createHttpsServer(certificates) : undefined;
		const websocketServer = options.liveReload.activated && websocketHttpsServer != null ? new WebSocket.Server({server: websocketHttpsServer}) : undefined;

		// Create a simple HTTP redirect server
		const httpServer = createServer((request, response) => {
			// Redirect the request to HTTPS
			response.writeHead(this.HTTP_REDIRECT_STATUS_CODE, {Location: `https://${request.headers.host}${request.url}`});
			response.end();
		});

		// Run the server
		const httpsServer = createSecureServer(certificates, async (request, response) => this.onRequest(request, response, options, websocketPort));

		// Sets the server that matches the options (so we can retrieve it later)
		this.setServerSetForOptions({
			http: httpServer,
			https: httpsServer,
			tcp: tcpServer,
			websocket: websocketServer
		}, options);

		// Start listening on the given port
		await Promise.all([
			new Promise<void>(resolve => tcpServer.listen({port: options.port, path: options.root}, resolve)),
			new Promise<void>(resolve => httpsServer.listen({port: httpsPort, path: options.root}, resolve)),
			new Promise<void>(resolve => httpServer.listen({port: httpPort, path: options.root}, resolve)),
			new Promise<void>(resolve => websocketHttpsServer == null ? resolve() : websocketHttpsServer.listen({port: websocketPort, path: `${options.root}${this.ensureLeadingSlash(options.liveReload.path)}`}, resolve))
		]);

		// Add the options to the Set of active options
		this.activeOptions.add(options);

		return {
			liveReload: async (): Promise<void> => {
				if (!options.liveReload.activated || websocketServer == null) {
					throw new Error(`${this.constructor.name} could not liveReload: 'liveReload.activated' given in the options to '${this.serve.name}'() was false!`);
				}

				websocketServer.clients.forEach(client => {
					if (client.readyState === WebSocket.OPEN) {
						client.send("reload");
					}
				});
			}
		};
	}

	/**
	 * Stops all currently running servers
	 * @returns {Promise<void>}
	 */
	public async stop (): Promise<void> {
		for (const {http, https} of this.serverMap.values()) {
			await Promise.all([
				this.stopServer(http),
				this.stopServer(https)
			]);
		}

		// Clear all active options
		this.activeOptions.clear();
	}

	/**
	 * Removes the leading slash from a path
	 * @param {string} path
	 * @returns {string}
	 */
	private ensureLeadingSlash (path: string): string {
		return path.startsWith("/") ? path : `/${path}`;
	}
	/**
	 * Called when a request happens
	 * @param {Http2ServerRequest} rawRequest
	 * @param {Http2ServerResponse} rawResponse
	 * @param {IDevServerServiceServeOptions} serverOptions
	 * @param {number} websocketPort
	 * @returns {Promise<void>}
	 */
	private async onRequest (rawRequest: Http2ServerRequest, rawResponse: Http2ServerResponse, serverOptions: IDevServerServiceServeOptions, websocketPort: number): Promise<void> {
		const request = getRequestFromIncomingHeaders(rawRequest.headers);

		const handleOptions: IRequestHandlerOptions = {
			request,
			serverOptions,
			websocketPort,
			fallbackIndex: serverOptions.fallbackIndex,

			/**
			 * When a response is ready to be sent, let outside subscribers receive and potentially manipulate the headers of the response
			 * @param {Request} req
			 * @param {Response} res
			 * @param {string} localRoot
			 */
			onResponseReady: (req, res, localRoot): void => {
				for (const subscriber of this.onResponseReadySubscribers) {
					subscriber(req, res, localRoot);
				}
				return;
			},

			/**
			 * When the index.html file is request, let outside subscribers provide a path to it
			 * @param {string} userAgent
			 * @param {string} root
			 * @returns {string}
			 */
			onRequestIndex: (userAgent, root): IRequestIndexSubscriberResult|EmptyResult => {
				// Check if any of the subscribers can match an index.html file
				for (const subscriber of this.onRequestIndexSubscribers) {
					const subscriberResult = subscriber(userAgent, root);
					if (subscriberResult != null) {
						this.logger.debug(`index.html was matched by a bundle: '${subscriberResult.path}'`);
						return subscriberResult;
					}
				}
			}
		};

		sendResponse(rawResponse, await this.requestHandler.handle(<RequestHandlerOptions> handleOptions));
	}

	/**
	 * Stops the server that matches the given options
	 * @param {IDevServerServiceServeOptions} options
	 * @returns {Promise<void>}
	 */
	private async stopServerSetForOptions (options: IDevServerServiceServeOptions): Promise<void> {
		const server = this.getServerSetForOptions(options);
		if (server == null) return;
		await Promise.all([
			this.stopServer(server.http),
			this.stopServer(server.https),
			this.stopServer(server.tcp),
			server.websocket != null ? this.stopServer(server.websocket) : Promise.resolve()
		]);

		// Remove the options from the Set of active options
		this.activeOptions.delete(options);
	}

	/**
	 * Stops the given server (by closing its' connection)
	 * @param {Http2SecureServer|HttpServer|TCPServer|WebSocket.Server} server
	 * @returns {Promise<void>}
	 */
	private async stopServer (server: Http2SecureServer|HttpServer|TCPServer|WebSocket.Server): Promise<void> {
		return new Promise<void>(resolve => {
			// If there is not server to stop, do nothing
			if (server == null) return resolve();

			(<Http2SecureServer|HttpServer|TCPServer>server).close(() => {
				resolve();
			});
		});
	}

	/**
	 * Gets a Uid to use for the server map
	 * @param {IDevServerServiceServeOptions} options
	 * @returns {string}
	 */
	private getServerMapUid ({host, port}: IDevServerServiceServeOptions): string {
		return JSON.stringify({host, port});
	}

	/**
	 * Gets the server set that matches the given options
	 * @param {IDevServerServiceServeOptions} options
	 * @returns {IServerSet | undefined}
	 */
	private getServerSetForOptions (options: IDevServerServiceServeOptions): IServerSet|undefined {
		return this.serverMap.get(this.getServerMapUid(options));
	}

	/**
	 * Sets the server that matches the given options
	 * @param {IServerSet} serverSet
	 * @param {IDevServerServiceServeOptions} options
	 */
	private setServerSetForOptions (serverSet: IServerSet, options: IDevServerServiceServeOptions): void {
		this.serverMap.set(this.getServerMapUid(options), serverSet);
	}

}