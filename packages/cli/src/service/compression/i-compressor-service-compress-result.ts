export interface ICompressorServiceCompressBrotliResult {
	brotli: Buffer;
}

export interface ICompressorServiceCompressGzipResult {
	gzip: Buffer;
}

export interface ICompressorServiceCompressBrotliAndGzipResult extends ICompressorServiceCompressBrotliResult, ICompressorServiceCompressGzipResult {
}

export type CompressorServiceResult<Brotli extends (boolean|undefined), Gzip extends (boolean|undefined)> =
	Brotli extends true
		? Gzip extends true
		? ICompressorServiceCompressBrotliAndGzipResult
		: ICompressorServiceCompressBrotliResult
		: Brotli extends (false|undefined)
		? Gzip extends true
			? ICompressorServiceCompressGzipResult
			: {} : {};