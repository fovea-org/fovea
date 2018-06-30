import {IConfigGenerator} from "./i-config-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";

/**
 * A class that helps with generating environment files
 */
export class ConfigGenerator extends Generator implements IConfigGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter) {
		super();
	}

	/**
	 * Generates the config file which holds user-provided app global configuration properties, including
	 * the environment variable values
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		return [
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/config`,
				children: [
					{
						kind: TemplateFileKind.FILE,
						name: "config",
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
							import {environment} from "../environment/environment";
							import {IResource} from "@fovea/cli";

							/**
							 * The app config. Contains environment variable values as well as additional configuration properties
							 */
							export const config = {
								...environment,
								PRODUCTION: environment.NODE_ENV === "production",
								DEVELOPMENT: environment.NODE_ENV === "development",
								STAGING: environment.NODE_ENV === "staging",
								RESOURCE: <IResource> JSON.parse(environment.RESOURCE),
								WATCH: environment.WATCH === "true",
								isESM: () => environment.MODULE_KIND === "es"
								// Add additional config properties here
							};
							`, {...this.config.formatOptions, parser: "typescript"}
						)
					}
				]
			}
		];
	}
}