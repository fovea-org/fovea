import {IManifestJsonWriterService} from "./i-manifest-json-writer-service";
import {WriterService} from "../writer-service";
import {IManifestJson} from "../../../manifest-json/i-manifest-json";
import {WriterServiceEntry} from "../writer-service-entry";
import {IWriterServiceWriteOptions} from "../i-writer-service-write-options";

/**
 * A class that helps with writing a manifest.json to disk
 */
export class ManifestJsonWriterService extends WriterService<IManifestJson> implements IManifestJsonWriterService {

	/**
	 * Writes the given manifest.json file to disk
	 * @param {WriterServiceEntry<IManifestJson>} data
	 * @param {IWriterServiceWriteOptions} options
	 * @returns {Promise<void>}
	 */
	protected async writeFile ([path, manifest]: WriterServiceEntry<IManifestJson>, options: IWriterServiceWriteOptions): Promise<void> {
		const formatted = this.formatter.format(JSON.stringify(manifest), {...this.config.formatOptions, parser: "json"});

		await this.fileSaver.save(
			path,
			formatted
		);

		if (options.production) {
			await this.compressor.compressAndWrite(Buffer.from(formatted), path);
		}
	}
}