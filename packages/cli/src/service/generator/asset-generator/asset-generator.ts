import {IAssetGenerator} from "./i-asset-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {MAIN_ICON} from "./asset/main-icon";
import {Buffer} from "buffer";

/**
 * A class that helps with generating asset files
 */
export class AssetGenerator extends Generator implements IAssetGenerator {
	/**
	 * A Regular Expression that matches the part of a base64-optimized string that serves as the data fields
	 * @type {RegExp}
	 */
	private static readonly BASE64_DATA_PART_REGEX = /^data:image\/[a-z]+;base64,/;

	constructor (private readonly config: IBuildConfig) {
		super();
	}

	/**
	 * Generates the 'environment' files
	 * @returns {Promise<string>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		// Take the environment-defaults

		return [
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/${this.config.assetFolderName}`,
				children: [
					{
						kind: TemplateFileKind.DIRECTORY,
						name: this.config.iconFolderName,
						children: [
							{
								kind: TemplateFileKind.FILE,
								name: this.config.appIconName,
								extension: "png",
								content: Buffer.from(this.normalizeBase64EncodedImage(MAIN_ICON), "base64")
							}
						]
					}
				]
			}
		];
	}

	/**
	 * Normalizes a base64 optimized image by removing the 'data:image...' part
	 * @param {string} content
	 * @returns {string}
	 */
	private normalizeBase64EncodedImage (content: string): string {
		return content.replace(AssetGenerator.BASE64_DATA_PART_REGEX, "");
	}

}