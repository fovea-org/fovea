import {IMinifierServiceOptions} from "./i-minifier-service-options";

export interface IMinifierService {
	minify (options: IMinifierServiceOptions): string;
}