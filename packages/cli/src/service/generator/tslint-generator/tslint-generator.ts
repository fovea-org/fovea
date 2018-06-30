import {ITslintGenerator} from "./i-tslint-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {ITslintGeneratorOptions} from "./i-tslint-generator-options";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IFormatter} from "../../../formatter/i-formatter";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {ITslintConfiguration} from "../../../tslint/i-tslint-configuration";

/**
 * A class that helps with generating a tslint.json file
 */
export class TslintGenerator extends Generator implements ITslintGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter,
							 private readonly normalizeFunction: NormalizeFunction<ITslintConfiguration>) {
		super();
	}

	/**
	 * Generates tslint.json data based on the given options
	 * @param {Partial<ITslintConfiguration>} options
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: ITslintGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: this.config});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: this.config.tslintName,
				extension: "json",
				content: this.formatter.format(
					JSON.stringify(merged.config),
					{...this.config.formatOptions, parser: "json"}
				)
			}
		];
	}
}