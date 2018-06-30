export interface IAssetOutputResource {
	appIcon: { [key: string]: string };
	other: { [key: string]: string };
}

export interface IOutputResource {
	manifestJson: string;
	indexHtml: string;
	chunk: {
		[key: string]: string;
		main: string;
		serviceWorker: string;
	};
	asset: IAssetOutputResource;
}

export interface IStyleResource {
	themeVariables: { [key: string]: string };
}

export interface IResource {
	style: IStyleResource;
	output: IOutputResource;
}