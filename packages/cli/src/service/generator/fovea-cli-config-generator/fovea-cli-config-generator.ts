import {IFoveaCliConfigGenerator} from "./i-fovea-cli-config-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IFoveaCliConfigGeneratorOptions} from "./i-fovea-cli-config-generator-options";
import {IFormatter} from "../../../formatter/i-formatter";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";

/**
 * A class that helps with generating the fovea-cli config file
 */
export class FoveaCliConfigGenerator extends Generator implements IFoveaCliConfigGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter,
							 private readonly normalizeFunction: NormalizeFunction<IFoveaCliConfig>) {
		super();
	}

	/**
	 * Generates the fovea-cli config file
	 * @param {boolean} yarn
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: IFoveaCliConfigGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: this.config});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: this.config.foveaCliConfigName,
				extension: this.config.defaultScriptExtension,
				content: this.formatter.format(`
					// tslint:disable:no-default-export
					import {IFoveaCliConfig} from "@fovea/cli";
					import {browsersWithSupportForFeatures, browsersWithoutSupportForFeatures, matchBrowserslistOnUserAgent} from "@wessberg/browserslist-generator";

					/**
					 * This is the configuration for the Fovea CLI. These options will be used by the underlying build tools
					 */
					export default <Partial<IFoveaCliConfig>> ${merged.stringify()};
				`, {...this.config.formatOptions, parser: "typescript"})
			}
		];
	}
}