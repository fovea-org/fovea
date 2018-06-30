import {NormalizeFunction} from "../normalize/normalize-function";
import {IGitignore} from "./i-gitignore";

/**
 * A normalize function that retrieves a proper .gitignore configuration
 * @param {IBuildConfig} config
 * @param {Partial<IGitignore>} options
 * @returns {Promise<IStringifiableConfig<IGitignore>>}
 */
export const gitignoreNormalizeFunction: NormalizeFunction<IGitignore> = async ({config, options}) => ({
	config: [
		...(<string[]>options),
		"# Editor specific folders",
		"",
		".idea/",
		".vscode/",
		"",
		"# Output directories",
		"",
		`${config.distFolderName}/`,
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
		"*.log"
	],

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return this.config.join("\n");
	}
});