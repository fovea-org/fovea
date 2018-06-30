export interface IFoveaHostDefinerExportStatus {
	isDefaultExport: boolean;
	isNamedExport: boolean;
}

export interface IFoveaHostDefinerNoExportStatus extends IFoveaHostDefinerExportStatus {
	isDefaultExport: false;
	isNamedExport: false;
}

export interface IFoveaHostDefinerWithExportStatus extends IFoveaHostDefinerExportStatus {
	exportName: string;
}

export declare type FoveaHostDefinerExportStatus = IFoveaHostDefinerNoExportStatus|IFoveaHostDefinerWithExportStatus;