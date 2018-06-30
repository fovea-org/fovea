import {IResource} from "../resource/i-resource";

export interface IIndexHtmlOptions {
	resource: IResource;
	globalStyles: string;
	polyfillContent: string;
	polyfillUrl: string;
}