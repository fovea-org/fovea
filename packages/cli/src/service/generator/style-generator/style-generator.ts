import {IStyleGenerator} from "./i-style-generator";
import {TemplateFile, TemplateFileKind} from "../template-generator/template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";

/**
 * A class that helps with generating shared style files
 */
export class StyleGenerator extends Generator implements IStyleGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter) {
		super();
	}

	/**
	 * Gets an array based on the alpha channel (opacity) color steps to use
	 * @returns {number[]}
	 */
	private get colorAlphaChannelSteps (): number[] {
		return Array
			.from(Array(100 + 1)
				.keys())
			.filter(num => num > 0 && num % (100 / this.config.styleOptions.colorAlphaChannelSteps) === 0)
			.map(num => num / 100);
	}

	/**
	 * Generates the style files
	 * @returns {Promise<string>}
	 */
	public async onGenerate (): Promise<TemplateFile[]> {
		return [
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/style`,
				children: [
					{
						kind: TemplateFileKind.FILE,
						name: this.config.baseStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							// Add your base .${this.config.defaultCssExtension} content here

							// These variables will have their values replaced on build-time
							$NODE_ENV: null;
							$NPM_PACKAGE_NAME: null;
							$NPM_PACKAGE_VERSION: null;
							$WATCH: null;
							$TAG: null;
							$HASH: null;
							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.colorStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							// This file contains color variables

							:host, :root {
								--rgb-black: 0, 0, 0;
								--rgb-white: 255, 255, 255;
								--rgb-red: 221, 44, 0;
								--rgb-pink: 255, 83, 112;
								--rgb-purple: 199, 146, 234;
								--rgb-green: 86, 207, 119;
								--rgb-yellow: 227, 186, 76;
								--rgb-blue: 130, 177, 255;
								--rgb-orange: 255, 160, 0;

								${this.formatColorSteps("black")}

								${this.formatColorSteps("white")}

								${this.formatColorSteps("red")}

								${this.formatColorSteps("pink")}

								${this.formatColorSteps("purple")}

								${this.formatColorSteps("green")}

								${this.formatColorSteps("yellow")}

								${this.formatColorSteps("blue")}

								${this.formatColorSteps("orange")}

								// Primary and accent colors for the app
								--color-primary: var(--color-blue);
								--color-accent: var(--color-purple);
								--color-background: rgba(var(--rgb-black), .1);

								// Add additional colors here
							}
							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.fontStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							// This file contains font variables

							:host,
							:root {
								--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
							}
							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.sharedStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							@import "./${this.config.baseStylesName}";

							// Define your shared styles here. These will only be imported once, But will affect all of the components that append them within their Shadow Root

							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.themeStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							// This file should be imported once by your root component or by your global styles. These variables will be accessible from all child roots local to where it is injected.
							@import "./${this.config.baseStylesName}";
							@import "./${this.config.colorStylesName}";
							@import "./${this.config.fontStylesName}";
							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.globalStylesName,
						extension: this.config.defaultCssExtension,
						content: this.formatter.format(`
							@import "./${this.config.themeStylesName}";

							// This file should contain the global styles that will appear in your index.html file
							* {
								font-family: var(--font-family);
								box-sizing: border-box;
							}

							body {
								margin: 0;
							}

							`, {...this.config.formatOptions, parser: this.config.defaultCssExtension}
						)
					}
				]
			}
		];
	}

	/**
	 * Formats the
	 * @param {string} colorName
	 * @returns {string}
	 */
	private formatColorSteps (colorName: string): string {
		return this.colorAlphaChannelSteps
			.map(step => (
				step === 1
					? `--color-${colorName}: rgb(var(--rgb-${colorName}));`
					: `--color-${colorName}-${+(step * 100).toFixed(2)}: rgba(var(--rgb-${colorName}), ${step});`
			))
			.join("\n");
	}

}