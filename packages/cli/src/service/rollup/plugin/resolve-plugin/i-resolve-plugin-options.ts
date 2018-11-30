import {ResolvePluginModuleCallback} from "./resolve-plugin-module-callback";
import {PackageJsonMainField} from "../../../../package-json/i-package-json";

export interface IResolvePluginOptions {
	cwd: string;
	moduleDirectory: string;
	prioritizedPackageKeys: PackageJsonMainField[];
	prioritizedExtensions: string[];
	selectPackageField: ResolvePluginModuleCallback;
}