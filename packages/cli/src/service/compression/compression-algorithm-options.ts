export interface ICompressionAlgorithmOptions {
	gzip?: boolean;
	brotli?: boolean;
}

/**
 * The default Compression algorithm options
 * @type {ICompressionAlgorithmOptions}
 */
export const compressionAlgorithmOptions: ICompressionAlgorithmOptions = {
	gzip: true,
	brotli: true
};