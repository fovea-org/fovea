import {ContentEncodingKind} from "./encoding/content-encoding-kind";

export interface ILoadedResource {
	buffer: Buffer;
	path: string;
	contentType: string;
	contentEncoding?: ContentEncodingKind;
}