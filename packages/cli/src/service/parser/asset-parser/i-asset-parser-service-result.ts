
export interface IAssetParserServiceAssetEndResult {
	[key: string]: Buffer;
}
export interface IAssetParserServiceAppIconEndResult {
	path: string;
	buffer: Buffer;
}

export interface IAssetParserServiceEndResult {
	assetMap: IAssetParserServiceAssetEndResult;
	appIcon: IAssetParserServiceAppIconEndResult;
}