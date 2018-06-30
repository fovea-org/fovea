// tslint:disable:no-any

import {IPackageJson} from "./i-package-json";

export interface IPackage {
	path: string;
	content: IPackageJson;
}