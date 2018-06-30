import {IIndexHtmlWriterService} from "./i-index-html-writer-service";
import {WriterService} from "../writer-service";
import {WriterServiceEntry} from "../writer-service-entry";
import {IWriterServiceWriteOptions} from "../i-writer-service-write-options";

// tslint:disable:no-any

/**
 * A class that helps with writing a index.html file to disk
 */
export class IndexHtmlWriterService extends WriterService<string> implements IIndexHtmlWriterService {

	/**
	 * Writes the given index.html file to disk
	 * @param {WriterServiceEntry<string>} data
	 * @param {IWriterServiceWriteOptions} options
	 * @returns {Promise<void>}
	 */
	protected async writeFile ([path, indexHtml]: WriterServiceEntry<string>, options: IWriterServiceWriteOptions): Promise<void> {
		const formatted = indexHtml;
		await this.fileSaver.save(
			path,
			formatted
		);

		if (options.production) {
			await this.compressor.compressAndWrite(Buffer.from(formatted), path);
		}
	}
}