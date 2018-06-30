import {IPackageJsonGenerator} from "./i-package-json-generator";
import {IPackageJson} from "../../../package-json/i-package-json";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IFormatter} from "../../../formatter/i-formatter";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IPackageJsonGeneratorOptions} from "./i-package-json-generator-options";
import {PackageJsonUserOptions} from "../../../package-json/package-json-user-options";
import {IPackageJsonNormalizeFunctionConfig} from "../../../package-json/i-package-json-normalize-function-config";

/**
 * A class that helps with generating a package.json file
 */
export class PackageJsonGenerator extends Generator implements IPackageJsonGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter,
							 private readonly normalizeFunction: NormalizeFunction<IPackageJson, PackageJsonUserOptions, IPackageJsonNormalizeFunctionConfig>) {
		super();
	}

	/**
	 * Generates package.json data based on the given options
	 * @param {PackageJsonUserOptions} options
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate ({options}: IPackageJsonGeneratorOptions): Promise<TemplateFile[]> {
		// Take the merged options
		const merged = await this.normalizeFunction({options, config: {...this.config, skipDependencies: false}});

		return [
			{
				kind: TemplateFileKind.FILE,
				name: "package",
				extension: "json",
				content: this.formatter.format(
					JSON.stringify(merged.config),
					{...this.config.formatOptions, parser: "json"}
				)
			}
		];
	}
}