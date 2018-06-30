export interface IAssetParserServiceResult {
	assetMap: {[key: string]: Buffer};
	appIcon: {
		path: string;
		buffer: Buffer;
	};
}