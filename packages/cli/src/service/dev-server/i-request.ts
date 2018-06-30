export interface IRequest {
	method: "GET"|"PUT"|"POST"|"DELETE"|"OPTIONS";
	url: URL;
	userAgent: string;
	accept?: Set<string>;
	acceptEncoding?: Set<string>;
	acceptLanguage?: Set<string>;
	cachedChecksum: string;
}

export interface IGetRequest extends IRequest {
	method: "GET";
}

export interface IPutRequest extends IRequest {
	method: "PUT";
}

export interface IPostRequest extends IRequest {
	method: "POST";
}

export interface IDeleteRequest extends IRequest {
	method: "DELETE";
}

export interface IOptionsRequest extends IRequest {
	method: "OPTIONS";
}

export declare type Request = IGetRequest|IPutRequest|IPostRequest|IDeleteRequest|IOptionsRequest;