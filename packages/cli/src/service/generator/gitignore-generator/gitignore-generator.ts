import {IGitignoreGenerator} from "./i-gitignore-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IGitignoreGeneratorOptions} from "./i-gitignore-generator-options";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IGitignore} from "../../../gitignore/i-gitignore";

/**
 * A class that helps with generating a .gitignore file
 */
export class GitignoreGenerator extends Generator implements IGitignoreGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly normalizeFunction: NormalizeFunction<IGitignore>) {
		super();
	}

	/**
	 * Generates .gitignore data based on the given options
	 * @param {Partial<IGitignore>} options
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: IGitignoreGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: this.config});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: this.config.gitignoreName,
				extension: "",
				content: merged.stringify()
			}
		];
	}
}