import {ContentEncodingKind} from "./encoding/content-encoding-kind";

export interface ILoadedResource {
	buffer: Buffer;
	path: string;
	contentType: string;
	contentEncoding?: ContentEncodingKind;
	checksum: string;
}

export interface INotModifiedResource {
	path: string;
}

export declare type LoadedResource = ILoadedResource|INotModifiedResource;