import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IPackageJson} from "../../../package-json/i-package-json";

export interface IProject {
	root: string;
	foveaCliConfig: IFoveaCliConfig;
	packageJson: IPackageJson;
	hash: string;
}