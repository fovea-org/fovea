import {IFileTypeDetectorService} from "./i-file-type-detector-service";
import {FileFormatKind} from "../../format/file-format-kind";
import FileType from "file-type";
import {ImageFormatKind} from "../../format/image-format-kind";
import {extname} from "path";
import {UnknownFormatKind} from "../../format/unknown-format-kind";
import {ScriptFormatKind} from "../../format/script-format-kind";

/**
 * A service that helps with identifying the type of a file
 */
export class FileTypeDetectorService implements IFileTypeDetectorService {

	/**
	 * Detects the file type of the provided Buffer
	 * @param {Buffer} buffer
	 * @param {string} [path]
	 * @returns {FileFormatKind}
	 */
	public detect (buffer: Buffer, path?: string): FileFormatKind {

		// Take the extension information from that paths
		const {ext} = path != null ? {ext: extname(path).replace(".", "")} : FileType(buffer);

		switch (ext) {
			case "png":
				return ImageFormatKind.PNG;
			case "jpg":
				return ImageFormatKind.JPEG;
			case "gif":
				return ImageFormatKind.GIF;
			case "webp":
				return ImageFormatKind.WEBP;
			case "tif":
				return ImageFormatKind.TIFF;
			case "bmp":
				return ImageFormatKind.BMP;
			case "svg":
				return ImageFormatKind.SVG;
			case "js":
				return ScriptFormatKind.JAVASCRIPT;
			default:
				return UnknownFormatKind.UNKNOWN;
		}
	}

}