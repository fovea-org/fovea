import {ICreateTask} from "./i-create-task";
import {ICreateTaskExecuteOptions} from "./i-create-task-execute-options";
import {IProjectPathUtil} from "../../util/project-path-util/i-project-path-util";
import {install} from "../../util/install/install";
import {IBuildConfig} from "../../build-config/i-build-config";
import {IFileSaver} from "@wessberg/filesaver";
import {ILoggerService} from "../../service/logger/i-logger-service";
import chalk from "chalk";
import {IPackageJsonGenerator} from "../../service/generator/package-generator/i-package-json-generator";
import {ITsconfigGenerator} from "../../service/generator/tsconfig-generator/i-tsconfig-generator";
import {ITslintGenerator} from "../../service/generator/tslint-generator/i-tslint-generator";
import {IEnvironmentGenerator} from "../../service/generator/environment-generator/i-environment-generator";
import {IConfigGenerator} from "../../service/generator/config-generator/i-config-generator";
import {IFoveaCliConfigGenerator} from "../../service/generator/fovea-cli-config-generator/i-fovea-cli-config-generator";
import {IManifestGenerator} from "../../service/generator/manifest-generator/i-manifest-generator";
import {IIndexHtmlGenerator} from "../../service/generator/index-html-generator/i-index-html-generator";
import {ITemplateGenerator} from "../../service/generator/template-generator/i-template-generator";
import {IGitignoreGenerator} from "../../service/generator/gitignore-generator/i-gitignore-generator";
import {INpmignoreGenerator} from "../../service/generator/npmignore-generator/i-npmignore-generator";
import {IAssetGenerator} from "../../service/generator/asset-generator/i-asset-generator";
import {IStyleGenerator} from "../../service/generator/style-generator/i-style-generator";
import {TemplateFile, TemplateFileKind} from "../../service/generator/template-generator/template-file";
import {kebabCase} from "@wessberg/stringutil";

/**
 * A task used for creating a new Fovea project
 */
export class CreateTask implements ICreateTask {

	constructor (private readonly config: IBuildConfig,
							 private readonly logger: ILoggerService,
							 private readonly fileSaver: IFileSaver,
							 private readonly packageJsonGenerator: IPackageJsonGenerator,
							 private readonly tsconfigGenerator: ITsconfigGenerator,
							 private readonly tslintGenerator: ITslintGenerator,
							 private readonly environmentGenerator: IEnvironmentGenerator,
							 private readonly configGenerator: IConfigGenerator,
							 private readonly foveaCliConfigGenerator: IFoveaCliConfigGenerator,
							 private readonly manifestGenerator: IManifestGenerator,
							 private readonly indexHtmlGenerator: IIndexHtmlGenerator,
							 private readonly templateGenerator: ITemplateGenerator,
							 private readonly gitignoreGenerator: IGitignoreGenerator,
							 private readonly npmignoreGenerator: INpmignoreGenerator,
							 private readonly assetGenerator: IAssetGenerator,
							 private readonly styleGenerator: IStyleGenerator,
							 private readonly projectPathUtil: IProjectPathUtil) {
	}

	/**
	 * Executes a 'create' task
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	public async execute (options: ICreateTaskExecuteOptions): Promise<void> {
		const projectFolder = this.projectPathUtil.getProjectRoot(options.folder);
		this.logger.debug(`Debugging is active`);

		const createMessage = `Creating a new Fovea project in: ${chalk.magenta(projectFolder)}`;

		// Don't show a spinner if verbose or debug output is on, in which case we want all the output we can get and be able to trace it
		(options.debug || options.verbose) ? this.logger.log(createMessage) : this.logger.logWithSpinner(createMessage);
		await this.createFolderStructure(options);

		await Promise.all([
			this.createPackageJson(options),
			this.createTsconfig(options),
			this.createTslintConfig(options),
			this.createAssets(options),
			this.createGitignore(options),
			this.createNpmignore(options),
			this.createEnvironments(options),
			this.createConfig(options),
			this.createFoveaCliConfig(options),
			this.createTemplate(options),
			this.createManifest(options),
			this.createIndexHtml(options),
			this.createStyles(options)
		]);

		if (options.install) {
			// Install all package dependencies
			await this.install(options);
		}
		this.logger.clearSpinner(`Successfully created the Fovea project ${chalk.magenta(options.folder)} in the directory: ${chalk.magenta(projectFolder)}! 🎉`);
		this.logger.log(`Inside that directory, you can run several commands:`);
		this.logger.log(``);
		this.logger.log(`${chalk.magenta(`npm run start`)}`);
		this.logger.log(`	Builds your app in watch mode and serves it with a secure HTTP/2 development server`);
		this.logger.log(`${chalk.magenta(`npm run watch`)}`);
		this.logger.log(`	Builds your app in watch mode`);
		this.logger.log(`${chalk.magenta(`npm run build`)}`);
		this.logger.log(`	Builds your app`);
		this.logger.log(``);
		this.logger.log(`The easiest way to get started is by typing:`);
		this.logger.log(`	${chalk.magenta(`cd`)} ${options.folder}`);
		this.logger.log(`	${chalk.magenta(`npm run start`)}`);
	}

	/**
	 * Installs all package dependencies
	 * @param {string} folder
	 * @param {boolean} yarn
	 * @returns {Promise<void>}
	 */
	private async install ({folder, yarn}: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.logWithSpinner(`Installing dependencies...`);
		await install(this.projectPathUtil.getProjectRoot(folder), yarn ? "yarn" : "npm");
	}

	/**
	 * Creates the folder given by the options
	 * @param {string} folder
	 * @param {boolean} verbose
	 * @param {boolean} debug
	 * @returns {Promise<void>}
	 */
	private async createFolderStructure ({folder, verbose, debug}: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.setVerbose(verbose);
		this.logger.setDebug(debug);
		this.logger.verbose(`Creating folder structure...`);
		await this.fileSaver.makeDirectory(this.projectPathUtil.getProjectRoot(folder));
		await this.fileSaver.makeDirectory(this.projectPathUtil.getPathFromProjectRoot(folder, this.config.srcFolderName));
	}

	/**
	 * Creates the folder given by the options
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createTemplate (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Generating the project files for the ${chalk.magenta(options.template)} template...`);
		await this.writeTemplateFiles(await this.templateGenerator.generate(options), options);
	}

	/**
	 * Writes all of the given template files to disk inside the project root
	 * @param {TemplateFile[]} templateFiles
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async writeTemplateFiles (templateFiles: TemplateFile[], options: ICreateTaskExecuteOptions): Promise<void> {
		await Promise.all(templateFiles.map(async templateFile => {
			await this.writeTemplateFile(templateFile, options);
			if (templateFile.kind === TemplateFileKind.DIRECTORY) {
				await this.writeTemplateFiles(templateFile.children, options);
			}
		}));
	}

	/**
	 * Writes the given template file to disk inside the project root
	 * @param {TemplateFile} templateFile
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async writeTemplateFile (templateFile: TemplateFile, options: ICreateTaskExecuteOptions): Promise<void> {
		switch (templateFile.kind) {
			case TemplateFileKind.DIRECTORY:
				return await this.fileSaver.makeDirectory(this.projectPathUtil.getPathFromProjectRoot(options.folder, templateFile.name));

			case TemplateFileKind.FILE:
				return await this.fileSaver.save(this.projectPathUtil.getPathFromProjectRoot(options.folder, `${templateFile.name}${templateFile.extension == null || templateFile.extension === "" ? "" : `.${templateFile.extension}`}`), templateFile.content);
		}
	}

	/**
	 * Creates the tsconfig.json file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createTsconfig (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.tsconfigName}.json`)} file...`);
		await this.writeTemplateFiles(await this.tsconfigGenerator.generate({options: {}}), options);
	}

	/**
	 * Creates the tslint.json file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createTslintConfig (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.tslintName}.json`)} file...`);
		await this.writeTemplateFiles(await this.tslintGenerator.generate({options: {}}), options);
	}

	/**
	 * Creates the .gitignore file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createGitignore (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.gitignoreName}`)} file...`);
		await this.writeTemplateFiles(await this.gitignoreGenerator.generate({options: []}), options);
	}

	/**
	 * Creates the .npmignore file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createNpmignore (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.npmignoreName}`)} file...`);
		await this.writeTemplateFiles(await this.npmignoreGenerator.generate({options: []}), options);
	}

	/**
	 * Creates the environment folder and default environments
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createEnvironments (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating ${chalk.magenta(`${this.config.environmentFolderName}`)} files...`);
		await this.writeTemplateFiles(await this.environmentGenerator.generate(), options);
	}

	/**
	 * Creates the default assets
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createAssets (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating default ${chalk.magenta(`${this.config.assetFolderName}s`)}...`);
		await this.writeTemplateFiles(await this.assetGenerator.generate(), options);
	}

	/**
	 * Creates the styles folder and default styles
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createStyles (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating default ${chalk.magenta(`${this.config.stylesFolderName}s`)}...`);
		await this.writeTemplateFiles(await this.styleGenerator.generate(), options);
	}

	/**
	 * Creates the manifest.json.ts file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createManifest (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}.${this.config.defaultScriptExtension}`)} file...`);
		await this.writeTemplateFiles(await this.manifestGenerator.generate(), options);
	}

	/**
	 * Creates the index.html.ts file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createIndexHtml (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}.${this.config.defaultScriptExtension}`)} file...`);
		await this.writeTemplateFiles(await this.indexHtmlGenerator.generate(), options);
	}

	/**
	 * Creates the config folder and the config file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createConfig (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating ${chalk.magenta(`config`)} files...`);
		await this.writeTemplateFiles(await this.configGenerator.generate(), options);
	}

	/**
	 * Creates the config folder and the config file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createFoveaCliConfig (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating a ${chalk.magenta(`${this.config.foveaCliConfigName}.${this.config.defaultScriptExtension}`)} file...`);
		await this.writeTemplateFiles(await this.foveaCliConfigGenerator.generate({options: {packageManager: options.yarn ? "yarn" : "npm"}}), options);
	}

	/**
	 * Creates a package.json file
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<void>}
	 */
	private async createPackageJson (options: ICreateTaskExecuteOptions): Promise<void> {
		this.logger.verbose(`Creating ${chalk.magenta(`package.json`)} file...`);
		const name = this.getProjectName(options);
		await this.writeTemplateFiles(await this.packageJsonGenerator.generate({
			options: {
				name,
				description: name,
				version: this.config.defaultProjectVersion
			}
		}), options);
	}

	/**
	 * Generates a name for the project
	 * @param {string} folder
	 * @returns {string}
	 */
	private getProjectName ({folder}: ICreateTaskExecuteOptions): string {
		return kebabCase(folder)
			.toLowerCase();
	}
}