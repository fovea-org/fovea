import {IManifestGenerator} from "./i-manifest-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";

/**
 * A class that helps with generating a manifest.json.ts file
 */
export class ManifestGenerator extends Generator implements IManifestGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter) {
		super();
	}

	/**
	 * Generates the manifest.json file
	 * @returns {Promise<TemplateFile[]>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		return [
			{
				kind: TemplateFileKind.FILE,
				name: `${this.config.srcFolderName}/${this.config.manifestName}.${this.config.defaultJsonExtension}`,
				extension: this.config.defaultScriptExtension,
				content: this.formatter.format(`
				// tslint:disable:no-default-export

				import {IResource} from "@fovea/cli";
				import {environment} from "./environment/environment";
				import {toHex} from "@wessberg/color";

				/**
				 * This will generate a manifest.json file for your app
				 */
				export default (resource: IResource) => ({
					name: environment.NPM_PACKAGE_NAME,
					short_name: environment.NPM_PACKAGE_NAME,
					start_url: "/",
					display: "standalone",
					orientation: "portrait",
					background_color: toHex(resource.style.themeVariables["--color-background"]),
					theme_color: toHex(resource.style.themeVariables["--color-primary"]),
					icons: Object.entries(resource.output.asset.appIcon).map(([size, path]) => (
						{
							src: path,
							type: "image/png",
							sizes: \`\${size}x\${size}\`
						}
					)
				)
			});
				`,
					{...this.config.formatOptions, parser: "typescript"})
			}
		];
	}
}