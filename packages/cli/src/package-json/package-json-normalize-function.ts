import stringifyObject from "stringify-object";
import {NormalizeFunction} from "../normalize/normalize-function";
import {IPackageJson} from "./i-package-json";
// @ts-ignore
import latestVersion from "latest-version";
import deepExtend from "deep-extend";
import {PackageJsonUserOptions} from "./package-json-user-options";
import {IPackageJsonNormalizeFunctionConfig} from "./i-package-json-normalize-function-config";

/**
 * A normalize function that retrieves a proper IPackageJson
 * @param {IBuildConfig} config
 * @param {Partial<IPackageJson>} options
 * @returns {Promise<IStringifiableConfig<IPackageJson>>}
 */
export const packageJsonNormalizeFunction: NormalizeFunction<IPackageJson, PackageJsonUserOptions, IPackageJsonNormalizeFunctionConfig> = async ({config, options}) => ({
	config: {
		...deepExtend(await getDefaultPackageJsonData(config), options)
	},

	/**
	 * Stringifies the entire normalize function
	 * @returns {string}
	 */
	stringify () {
		return stringifyObject(this.config, config.stringifyObjectOptions);
	}
});

/**
 * Retrieves the default options to use for the generated package.json file
 * @param {boolean} skipDependencies
 * @returns {Promise<Partial<IPackageJson>>}
 */
async function getDefaultPackageJsonData ({skipDependencies}: IPackageJsonNormalizeFunctionConfig): Promise<Partial<IPackageJson>> {
	return {
		private: true,
		license: "MIT",
		scripts: {
			build: "fovea build",
			start: "fovea build --serve --watch",
			watch: "fovea build --watch",
			lint: "tslint -c tslint.json -p tsconfig.json"
		},
		...(skipDependencies ? {} : await getDependencies())
	};
}

/**
 * Gets all of the latest dependencies from npm
 * @returns {Promise<Partial<IPackageJson>>}
 */
async function getDependencies (): Promise<Partial<IPackageJson>> {
	const [
		tslintVersion,
		typescriptVersion,
		tslibVersion,
		typesNodeVersion,
		typesWorkboxSWVersion,
		browserslistGeneratorVersion,
		colorVersion,
		foveaCoreVersion,
		foveaLibVersion,
		foveaCommonVersion,
		foveaSchedulerVersion,
		foveaCliVersion,
		foveaRouterVersion] = await Promise.all([
		await latestVersion("tslint"),
		await latestVersion("typescript"),
		await latestVersion("tslib"),
		await latestVersion("@types/node"),
		await latestVersion("@types/workbox-sw"),
		await latestVersion("@wessberg/browserslist-generator"),
		await latestVersion("@wessberg/color"),
		await latestVersion("@fovea/core"),
		await latestVersion("@fovea/lib"),
		await latestVersion("@fovea/common"),
		await latestVersion("@fovea/scheduler"),
		await latestVersion("@fovea/cli"),
		await latestVersion("@fovea/router")
	]);
	return {
		devDependencies: {
			tslint: `^${tslintVersion}`,
			typescript: `^${typescriptVersion}`,
			"@fovea/cli": `^${foveaCliVersion}`,
			"@wessberg/browserslist-generator": `^${browserslistGeneratorVersion}`,
			"@wessberg/color": `^${colorVersion}`
		},
		dependencies: {
			"@types/node": `^${typesNodeVersion}`,
			"@types/workbox-sw": `^${typesWorkboxSWVersion}`,
			"@fovea/core": `^${foveaCoreVersion}`,
			"@fovea/lib": `^${foveaLibVersion}`,
			"@fovea/common": `^${foveaCommonVersion}`,
			"@fovea/scheduler": `^${foveaSchedulerVersion}`,
			"@fovea/router": `^${foveaRouterVersion}`,
			tslib: `^${tslibVersion}`
		}
	};
}