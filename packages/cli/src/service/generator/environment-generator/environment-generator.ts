import {IEnvironmentGenerator} from "./i-environment-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IEnvironmentDefaults} from "../../../environment/i-environment-defaults";

/**
 * A class that helps with generating environment files
 */
export class EnvironmentGenerator extends Generator implements IEnvironmentGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter,
							 private readonly normalizeFunction: NormalizeFunction<IEnvironmentDefaults>) {
		super();
	}

	/**
	 * Generates the 'environment' files
	 * @returns {Promise<string>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		// Take the environment-defaults
		const merged = await this.normalizeFunction({options: {}, config: this.config});

		return [
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/${this.config.environmentFolderName}`,
				children: [
					{
						kind: TemplateFileKind.FILE,
						name: this.config.environmentDefaultsFileName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
							/**
							 * Provide the default values for each environment variable in case the values
							 * isn't provided by the build environment
							 */
							export const environmentDefaults = ${merged.stringify()}
							`, {...this.config.formatOptions, parser: "typescript"}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.environmentFileName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
							import {env} from "process";
							import {environmentDefaults} from "./${this.config.environmentDefaultsFileName}";

							/**
							 * This is finalized environment variables. Don't touch these! Leave them be as they are.
							 */
							export const environment = {
								...environmentDefaults,
								...env
							};
							`, {...this.config.formatOptions, parser: "typescript"}
						)
					}
				]
			}
		];
	}

}