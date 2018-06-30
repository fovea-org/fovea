import {IPackageJson, PackageJsonMainField} from "../../../../package-json/i-package-json";

export declare type ResolvePluginModuleCallback = (packageJson: IPackageJson) => PackageJsonMainField|void|null|undefined;