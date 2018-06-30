import {IPath} from "../path/i-path";

export interface IAssetOutputPath {
	appIcon: { [key: string]: IPath };
	other: { [key: string]: IPath };
}

export interface IOutputPath {
	hash: string;
	tag: string;
	directory: IPath;
	manifestJson: IPath;
	indexHtml: IPath;
	asset: IAssetOutputPath;
}