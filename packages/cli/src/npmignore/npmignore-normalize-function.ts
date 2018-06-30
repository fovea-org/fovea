import {NormalizeFunction} from "../normalize/normalize-function";
import {INpmignore} from "./i-npmignore";

/**
 * A normalize function that retrieves a proper .npmignore configuration
 * @param {IBuildConfig} config
 * @param {Partial<INpmignore>} options
 * @returns {Promise<IStringifiableConfig<INpmignore>>}
 */
export const npmignoreNormalizeFunction: NormalizeFunction<INpmignore> = async ({config, options}) => ({
	config: [
		...(<string[]>options),
		"# Editor specific folders",
		"",
		".idea/",
		".vscode/",
		"",
		"# Source directories",
		"",
		`${config.srcFolderName}/`,
		"",
		"# Certificates",
		"",
		"*.pem",
		"*.p12",
		"*.crt",
		"*.csr",
		"",
		"# OS files",
		"",
		".DS_Store",
		".DS_Store?",
		"._*",
		".Spotlight-V100",
		".Trashes",
		"ehthumbs.db",
		"Thumbs.db",
		"",
		"# Archive files",
		"",
		".tgz",
		"*.7z",
		"*.dmg",
		"*.gz",
		"*.iso",
		"*.jar",
		"*.rar",
		"*.tar",
		"*.zip",
		"",
		"# Environment files",
		"",
		".env",
		"",
		"# Caching",
		"",
		".cache/",
		"",
		"# Debugging",
		"",
		"npm-debug*",
		"coverage/",
		"lib-cov/",
		"*.log",
		"",
		"# Build tools",
		"",
		`${config.foveaCliConfigName}.${config.defaultScriptExtension}`,
		`${config.tsconfigName}.json`,
		`${config.tslintName}.json`
	],

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return this.config.join("\n");
	}
});