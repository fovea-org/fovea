import {INpmignoreGenerator} from "./i-npmignore-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {INpmignoreGeneratorOptions} from "./i-npmignore-generator-options";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {INpmignore} from "../../../npmignore/i-npmignore";

/**
 * A class that helps with generating a .npmignore file
 */
export class NpmignoreGenerator extends Generator implements INpmignoreGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly normalizeFunction: NormalizeFunction<INpmignore>) {
		super();
	}

	/**
	 * Generates .npmignore data based on the given options
	 * @param {Partial<INpmignore>} options
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: INpmignoreGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: this.config});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: this.config.npmignoreName,
				extension: "",
				content: merged.stringify()
			}
		];
	}
}