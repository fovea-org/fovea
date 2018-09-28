import {ICompressorService} from "./i-compressor-service";
import {gzip, ZlibOptions} from "zlib";
import {BrotliEncodeParams, compress as brotliCompress} from "iltorb";
import {CompressorServiceResult} from "./i-compressor-service-compress-result";
import {IFileSaver} from "@wessberg/filesaver";
import {ICompressionAlgorithmOptions} from "./compression-algorithm-options";

/**
 * A class that helps with compressing files with Brotli and Zlib
 */
export class CompressorService implements ICompressorService {

	/**
	 * The extension for Brotli-compressed files
	 * @type {string}
	 */
	private readonly BROTLI_EXTENSION: string = ".br";

	/**
	 * The extension for Zlib-compressed files
	 * @type {string}
	 */
	private readonly ZLIB_EXTENSION: string = ".gz";

	constructor (private readonly zlibCompressionOptions: ZlibOptions,
							 private readonly brotliCompressionOptions: BrotliEncodeParams,
							 private readonly fileSaver: IFileSaver) {
	}

	/**
	 * Compresses the given code based on the given options
	 * @param {Buffer} content
	 * @param {ICompressionAlgorithmOptions} options
	 * @returns {Promise<*>}
	 */
	public async compress (content: Buffer, options: ICompressionAlgorithmOptions): Promise<CompressorServiceResult<typeof options["brotli"], typeof options["gzip"]>> {
		return {
			...(options.brotli !== true ? {} : {brotli: await this.compressWithBrotli(content)}),
			...(options.gzip !== true ? {} : {gzip: await this.compressWithZlib(content)})
		};
	}

	/**
	 * Compresses the given content and writes it to the given path, including relevant prioritizedExtensions
	 * @param {Buffer} content
	 * @param {string} writePath
	 * @param {ICompressionAlgorithmOptions} options
	 * @returns {Promise<void>}
	 */
	public async compressAndWrite (content: Buffer, writePath: string, options: ICompressionAlgorithmOptions): Promise<void> {
		const response = await this.compress(content, options);

		await Promise.all([
			!("brotli" in response) ? Promise.resolve() : this.fileSaver.save(`${writePath}${this.BROTLI_EXTENSION}`, response.brotli),
			!("gzip" in response) ? Promise.resolve() : this.fileSaver.save(`${writePath}${this.ZLIB_EXTENSION}`, response.gzip)
		]);
	}

	/**
	 * Compresses the given code with Brotli based on the given options
	 * @param {string} code
	 * @returns {Promise<Buffer>}
	 */
	private async compressWithBrotli (code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			brotliCompress(code, this.brotliCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}

	/**
	 * Compresses the given code with Zlib based on the given options
	 * @param {Buffer} code
	 * @returns {Promise<Buffer>}
	 */
	private async compressWithZlib (code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			gzip(code, this.zlibCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}

}