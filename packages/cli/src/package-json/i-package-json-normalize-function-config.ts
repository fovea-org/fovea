import {IBuildConfig} from "../build-config/i-build-config";

export interface IPackageJsonNormalizeFunctionConfig extends IBuildConfig {
	skipDependencies: boolean;
}