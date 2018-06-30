import {promises} from "fs";
import lernaConfig from "../lerna.json";
import G from "glob";
import {join, extname} from "path";
import {IPackage} from "./i-package";
import deepExtend from "deep-extend";
import chalk from "chalk";
import sharedPackage from "../shared/shared-package.json.js";
const {readFile, writeFile} = promises;

/**
 * Extends package.json files in all packages such that they conform to the same base rules
 * @returns {Promise<void>}
 */
async function extendPackageJsonFiles (): Promise<void> {
	const [packagesGlob] = lernaConfig.packages;
	const packageDirectories = (await new Promise<string[]>(resolve => G(packagesGlob, (_err, matches) => resolve(matches))))
		// Take only directories
		.filter(file => extname(file) === "");

	const packages: IPackage[] =
		[
			...await Promise.all(packageDirectories.map(async packageDirectory => {
				const absolutePackageDirectory = join(process.cwd(), packageDirectory);
				const packageJsonPath = join(absolutePackageDirectory, "package.json");
				const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());
				return {
					path: packageJsonPath,
					content: packageJson
				};
			}))
		];
	for (const packageJson of packages) {
		await extendPackageJson(packageJson);
	}
}

/**
 * Extends the given package.json file
 * @param {IPackage} packageJson
 * @returns {Promise<void>}
 */
async function extendPackageJson (packageJson: IPackage): Promise<void> {
	const merged = deepExtend({}, packageJson.content, sharedPackage);

	console.log(`Updating package.json: '${chalk.magenta(packageJson.path)}'`);

	// Overwrite the package.json file with the updated one
	await writeFile(packageJson.path, JSON.stringify(merged, null, "\t"));
}

(async () => extendPackageJsonFiles())();