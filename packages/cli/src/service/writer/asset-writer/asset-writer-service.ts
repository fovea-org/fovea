import {IAssetWriterService} from "./i-asset-writer-service";
import {WriterService} from "../writer-service";
import {WriterServiceEntry} from "../writer-service-entry";
import {IWriterServiceWriteOptions} from "../i-writer-service-write-options";

/**
 * A class that helps with writing assets to disk
 */
export class AssetWriterService extends WriterService<Buffer> implements IAssetWriterService {

	/**
	 * Writes the given buffer file to disk
	 * @param {WriterServiceEntry<Buffer>} data
	 * @param {IWriterServiceWriteOptions} options
	 * @returns {Promise<void>}
	 */
	protected async writeFile ([path, buffer]: WriterServiceEntry<Buffer>, options: IWriterServiceWriteOptions): Promise<void> {
		await this.fileSaver.save(
			path,
			buffer
		);

		if (options.production) {
			await this.compressor.compressAndWrite(buffer, path);
		}
	}
}