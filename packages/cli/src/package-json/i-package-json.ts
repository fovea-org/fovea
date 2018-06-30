import {IPackageJsonRequiredProperties} from "./i-package-json-required-properties";

export interface IRepository {
	type: string;
	url: string;
}

export interface IBugs {
	url: string;
}

export interface IAuthor {
	name: string;
	email: string;
	url: string;
}

export declare type PackageJsonMainField = "module"|"browser"|"es2015"|"main"|"jsnext:main";

export interface IPackageJson extends IPackageJsonRequiredProperties {
	scripts?: { [key: string]: string };
	keywords?: string[];
	devDependencies?: { [key: string]: string };
	peerDependencies?: { [key: string]: string };
	dependencies?: { [key: string]: string };
	module?: string;
	main?: string;
	"jsnext:main"?: string;
	browser?: string;
	types?: string;
	typings?: string;
	es2015?: string;
	repository?: IRepository;
	bugs?: IBugs;
	author?: IAuthor;
	authors?: IAuthor[];
	engines?: { [key: string]: string };
	license?: string;
	private?: boolean;
}