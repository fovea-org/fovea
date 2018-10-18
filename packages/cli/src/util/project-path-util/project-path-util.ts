import {IProjectPathUtil} from "./i-project-path-util";
import {isAbsolute, join, relative} from "path";
import {IFileLoader} from "@wessberg/fileloader";
import {IPathUtil} from "@wessberg/pathutil";
import {IBuildConfig} from "../../build-config/i-build-config";
import {IOutputPath} from "../../output-path/i-output-path";
import {IGetOutputPathsForOutputOptions} from "./i-get-output-paths-for-output-options";
import {IOutputResource} from "../../resource/i-resource";
import {BuildError} from "../../error/build-error/build-error";

/**
 * A utility class that helps with resolving paths within the project folder
 */
export class ProjectPathUtil implements IProjectPathUtil {

	constructor (private readonly config: IBuildConfig,
							 private readonly fileLoader: IFileLoader,
							 private readonly pathUtil: IPathUtil) {
	}

	/**
	 * Gets the absolute paths to something within the project root
	 * @param {string} folder
	 * @param {string} path
	 * @returns {string}
	 */
	public getPathFromProjectRoot (folder: string, path: string): string {
		return join(isAbsolute(folder) ? folder : this.getProjectRoot(folder), path);
	}

	/**
	 * Gets the (absolute) project root paths
	 * @param {string} folder
	 * @returns {string}
	 */
	public getProjectRoot (folder: string): string {
		return join(process.cwd(), folder);
	}

	/**
	 * Finds the project root directory. The project root will be the directory that contains the configuration file
	 * of the given name
	 * @param {string} configName
	 * @returns {string}
	 */
	public async findProjectRoot (configName: string): Promise<string> {
		let currentDir = process.cwd();

		while (currentDir != null && currentDir !== "" && currentDir !== "/") {
			if (this.fileLoader.existsSync(join(currentDir, configName))) {
				return currentDir;
			}
			currentDir = join(currentDir, "../");
		}

		throw new BuildError({
			message: "`FoveaCLI could not find a project root from location: ${process.cwd()}`",
			fatal: true
		});
	}

	/**
	 * Gets the directory for the given paths from the given root
	 * @param {string} root
	 * @param {string} path
	 * @returns {string}
	 */
	public getDirectoryFromProjectRoot (root: string, path: string): string {

		// If the paths is already absolute, just use it as it is
		if (isAbsolute(path)) return path;

		// Otherwise, join the root paths with the destination directory
		return join(root, this.pathUtil.takeExtension(path) === "" ? path : this.pathUtil.takeDirectory(path));
	}

	/**
	 * Removes whatever is given from the given paths
	 * @param {string} path
	 * @param {string} clear
	 * @returns {string}
	 */
	public clearFromPath (path: string, clear: string): string {
		const replaced = path
			.replace(clear, "");
		return replaced.startsWith("/") ? replaced.slice(1) : replaced;
	}

	/**
	 * Removes the source directory from the given paths
	 * @param {string} root
	 * @param {string} entry
	 * @param {string} path
	 * @returns {string}
	 */
	public clearBaseDirectoryFromPath (root: string, entry: string, path: string): string {
		// Gets the source directory from the application root
		const sourceDirectory = this.getDirectoryFromProjectRoot(root, entry);
		// Gets the relative paths to the source directory from the application root
		const relativeSourceDirectory = relative(root, sourceDirectory);

		const replaced = path
			.replace(sourceDirectory, "")
			.replace(relativeSourceDirectory, "");
		return replaced.startsWith("/") ? replaced.slice(1) : replaced;
	}

	/**
	 * Adds some mark to a paths, for example a hash or a build tag
	 * @param {string} path
	 * @param {string} mark
	 * @returns {string}
	 */
	public addMarkToPath (path: string, mark: string): string {
		if (mark === "") return path;
		return this.pathUtil.appendBeforeExtension(path, this.pathUtil.dotExtension(mark));
	}

	/**
	 * Gets all output paths for a specific output
	 * @param {IGetOutputPathsForOutputOptions} options
	 * @returns {IOutputPath}
	 */
	public getOutputPathsForOutput ({assets, foveaCliConfig, hash = "", output, root}: IGetOutputPathsForOutputOptions): IOutputPath {
		const clearRoot = (path: string) => this.clearBaseDirectoryFromPath(root, foveaCliConfig.entry, path);
		const clearDist = (dest: string, path: string) => this.clearBaseDirectoryFromPath(dest, path, path);
		const dotPrefixedHash = hash === "" ? "" : `.${hash}`;

		// Everything should be equal to the index.html file
		const destinationDirectory = this.getDirectoryFromProjectRoot(root, output.directory);
		const manifestJsonDestinationDirectory = destinationDirectory;
		const assetDestinationDirectory = join(destinationDirectory, this.config.assetFolderName);
		const appIconDestinationDirectory = join(assetDestinationDirectory, this.config.iconFolderName);
		const manifestJsonPath = join(manifestJsonDestinationDirectory, `${this.config.manifestName}${dotPrefixedHash}.${output.tag}.${this.config.defaultJsonExtension}`);
		const indexHtmlPath = join(destinationDirectory, `${this.config.indexName}${dotPrefixedHash}.${output.tag}.${this.config.defaultXMLScriptExtension}`);

		return {
			tag: output.tag,
			hash,
			directory: {
				absolute: destinationDirectory,
				relative: relative(destinationDirectory, destinationDirectory)
			},
			manifestJson: {
				absolute: manifestJsonPath,
				relative: relative(destinationDirectory, manifestJsonPath)
			},
			indexHtml: {
				absolute: indexHtmlPath,
				relative: relative(destinationDirectory, indexHtmlPath)
			},
			asset: {
				appIcon: assets == null ? {} : Object.assign({}, ...Object.keys(assets.appIconMap).map(key => ({[key]: (() => {
						const appIconPath = join(appIconDestinationDirectory, this.addMarkToPath(
							clearDist(appIconDestinationDirectory, clearRoot(this.pathUtil.appendBeforeExtension(foveaCliConfig.asset.appIcon.path, `-${key}x${key}`))),
							hash
						));
						return {
							absolute: appIconPath,
							relative: relative(destinationDirectory, appIconPath)
						};
					})()}))
				),
				other: assets == null ? {} : Object.assign({}, ...Object.keys(assets.assetMap).map(key => ({[key]: (() => {
						const otherAssetPath = join(assetDestinationDirectory, this.addMarkToPath(
							clearDist(assetDestinationDirectory, clearRoot(this.clearFromPath(key, foveaCliConfig.asset.path))),
							hash
						));
						return {
							absolute: otherAssetPath,
							relative: relative(destinationDirectory, otherAssetPath)
						};
					})()}))
				)
			}
		};
	}

	/**
	 * Takes the given outputPath and retrieves an IOutputResource from it
	 * @param {IOutputPath} outputPath
	 * @param {string[]} generatedChunkNames
	 * @returns {IOutputResource}
	 */
	public getOutputResourceFromOutputPath (outputPath: IOutputPath, generatedChunkNames: string[]): IOutputResource {
		const mainChunkName = generatedChunkNames.find(chunkName => chunkName.startsWith(this.config.entryName));
		const serviceWorkerChunkName = generatedChunkNames.find(chunkName => chunkName.startsWith(this.config.serviceWorkerName));
		const otherChunkNames = generatedChunkNames.filter(chunkName => chunkName !== mainChunkName && chunkName !== serviceWorkerChunkName);

		// Everything should be equal to the index.html file
		const assetDestinationDirectory = join(outputPath.directory.relative, this.config.assetFolderName);
		const clearBaseDirectory = (baseDirectory: string, path: string) => this.clearBaseDirectoryFromPath(baseDirectory, path, path);
		const ensureLeadingSlash = (path: string) => path.startsWith("/") ? path : `/${path}`;

		return {
			manifestJson: ensureLeadingSlash(outputPath.manifestJson.relative),
			indexHtml: ensureLeadingSlash(outputPath.indexHtml.relative),
			chunk: {
				main: ensureLeadingSlash(mainChunkName != null ? mainChunkName : `${this.config.entryName}.${outputPath.hash}.${outputPath.tag}.${this.config.defaultDestinationScriptExtension}`),
				serviceWorker: ensureLeadingSlash(serviceWorkerChunkName != null ? serviceWorkerChunkName : `${this.config.serviceWorkerName}.${outputPath.hash}.${this.config.serviceWorkerChunkPrefix}${outputPath.tag}.${this.config.defaultDestinationScriptExtension}`),
				...Object.assign({}, ...otherChunkNames.map(chunkName => ({[chunkName]: ensureLeadingSlash(chunkName)})))
			},
			asset: {
				appIcon: Object.assign({}, ...Object.entries(outputPath.asset.appIcon).map(([size, path]) => ({[size]: ensureLeadingSlash(path.relative)}))),
				other: Object.assign({}, ...Object.entries(outputPath.asset.other).map(([name, path]) => ({[clearBaseDirectory(assetDestinationDirectory, name)]: ensureLeadingSlash(path.relative)})))
			}
		};
	}
}