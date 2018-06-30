export enum TemplateFileKind {
	FILE, DIRECTORY
}

export interface ITemplateFileBase {
	kind: TemplateFileKind;
	name: string;
	parent?: ITemplateDirectory;
}

export interface ITemplateFile extends ITemplateFileBase {
	kind: TemplateFileKind.FILE;
	extension: string;
	content: string|Buffer;
}

export interface ITemplateDirectory extends ITemplateFileBase {
	kind: TemplateFileKind.DIRECTORY;
	children: TemplateFile[];
}

export declare type TemplateFile = ITemplateFile|ITemplateDirectory;