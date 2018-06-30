import {ContentEncodingKind} from "./encoding/content-encoding-kind";

export interface IGetFilepathWithEncodingResult {
	path: string;
	encoding: ContentEncodingKind|undefined;
	checksum: string;
}