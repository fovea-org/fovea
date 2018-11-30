import {IPackageJson} from "../../package-json/i-package-json";
import {IResource} from "../../resource/i-resource";
import {IFoveaCliConfig} from "../../fovea-cli-config/i-fovea-cli-config";

export interface ISharedRollupOptions {
	cwd: string;
	tsconfig: IFoveaCliConfig["tsconfig"];
	additionalEnvironmentVariables: { [key: string]: string };
	packageJson: IPackageJson;
	resource: IResource;
	config: IFoveaCliConfig;
}