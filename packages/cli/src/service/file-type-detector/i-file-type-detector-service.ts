import {FileFormatKind} from "../../format/file-format-kind";

export interface IFileTypeDetectorService {
	detect (buffer: Buffer, path?: string): FileFormatKind;
}