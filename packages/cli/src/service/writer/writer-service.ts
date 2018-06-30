import {IWriterService} from "./i-writer-service";
import {IFileSaver} from "@wessberg/filesaver";
import {IFormatter} from "../../formatter/i-formatter";
import {IBuildConfig} from "../../build-config/i-build-config";
import {IWriterServiceData} from "./i-writer-service-data";
import {WriterServiceEntry} from "./writer-service-entry";
import {ICompressorService} from "../compression/i-compressor-service";
import {IWriterServiceWriteOptions} from "./i-writer-service-write-options";

/**
 * The abstract base class for writers. Writers are classes that can write things to disk
 */
export abstract class WriterService<T> implements IWriterService<T> {

	constructor (protected readonly config: IBuildConfig,
							 protected readonly fileSaver: IFileSaver,
							 protected readonly formatter: IFormatter,
							 protected readonly compressor: ICompressorService) {}

	/**
	 * Writes the given content to the given paths
	 * @template T
	 * @param {IWriterServiceData<T>} data
	 * @param {IWriterServiceWriteOptions} options
	 * @returns {Promise<void>}
	 */
	public async write (data: IWriterServiceData<T>, options: IWriterServiceWriteOptions): Promise<void> {
		await Promise.all(Object.entries(data).map(async entry => this.writeFile(entry, options)));
	}

	/**
	 * Writes one of the given entries to disk
	 * @template T
	 * @param {WriterServiceEntry<T>} entry
	 * @param {IWriterServiceWriteOptions} options
	 * @returns {Promise<void>}
	 */
	protected abstract writeFile (entry: WriterServiceEntry<T>, options: IWriterServiceWriteOptions): Promise<void>;
}