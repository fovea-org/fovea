// tslint:disable:no-any

import {ContentEncodingKind} from "./encoding/content-encoding-kind";

export interface IResponse {
	statusCode: number;
	cacheControl?: string;
}

export interface IContentfulResponse extends IResponse {
	contentType: string;
	contentEncoding?: ContentEncodingKind;
	checksum?: string;
}

export interface INotModifiedResponse extends IResponse {
}

export interface IFileResponse extends IContentfulResponse {
}

export interface IJsonResponse extends IContentfulResponse {
	body: any;
}

export declare type Response = IFileResponse|IJsonResponse|INotModifiedResponse;