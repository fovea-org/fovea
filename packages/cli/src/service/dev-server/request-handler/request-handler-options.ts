import {IDeleteRequest, IGetRequest, IOptionsRequest, IPostRequest, IPutRequest, Request} from "../i-request";
import {IDevServerServiceServeOptions} from "../i-dev-server-service-serve-options";
import {ResponseReadySubscriber} from "../response-ready-subscriber";
import {RequestIndexSubscriber} from "../request-index-subscriber";
import {FallbackIndex} from "../fallback-index";

export interface IRequestHandlerOptions {
	request: Request;
	serverOptions: IDevServerServiceServeOptions;
	onRequestIndex: RequestIndexSubscriber;
	onResponseReady: ResponseReadySubscriber;
	fallbackIndex: FallbackIndex;
	websocketPort: number;
}

export interface IGetRequestHandlerOptions extends IRequestHandlerOptions {
	request: IGetRequest;
}

export interface IPutRequestHandlerOptions extends IRequestHandlerOptions {
	request: IPutRequest;
}

export interface IPostRequestHandlerOptions extends IRequestHandlerOptions {
	request: IPostRequest;
}

export interface IDeleteRequestHandlerOptions extends IRequestHandlerOptions {
	request: IDeleteRequest;
}

export interface IOptionsRequestHandlerOptions extends IRequestHandlerOptions {
	request: IOptionsRequest;
}

export declare type RequestHandlerOptions = IGetRequestHandlerOptions|IPutRequestHandlerOptions|IPostRequestHandlerOptions|IDeleteRequestHandlerOptions|IOptionsRequestHandlerOptions;