import {IPackageJsonParserService} from "./i-package-json-parser-service";
import {IPackageJsonParserServiceOptions} from "./i-package-json-parser-service-options";
import {IFileLoader} from "@wessberg/fileloader";
import {IPackageJson} from "../../../package-json/i-package-json";
import {NormalizeFunction} from "../../../normalize/normalize-function";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {PackageJsonUserOptions} from "../../../package-json/package-json-user-options";
import {IPackageJsonNormalizeFunctionConfig} from "../../../package-json/i-package-json-normalize-function-config";
import {IWatchService} from "../../watch/i-watch-service";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

/**
 * A class that helps with parsing a package.json file
 */
export class PackageJsonParserService implements IPackageJsonParserService {

	constructor (private readonly fileLoader: IFileLoader,
							 private readonly config: IBuildConfig,
							 private readonly watchService: IWatchService,
							 private readonly normalizeFunction: NormalizeFunction<IPackageJson, PackageJsonUserOptions, IPackageJsonNormalizeFunctionConfig>) {
	}

	/**
	 * Parses the config matched by the given options and returns an IFoveaCliConfig
	 * @param {IPackageJsonParserServiceOptions} options
	 * @param {ISubscriber<IPackageJson>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({path, watch}: IPackageJsonParserServiceOptions, subscriber: ISubscriber<IPackageJson>): IObserver {

		// Watch for changes to the package.json file and load it when it changes
		const watcher = this.watchService.watch(path, {persistent: watch}, async () => {
			subscriber.onStart();

			const userPackage: IPackageJson = JSON.parse((await this.fileLoader.load(path)).toString());

			// Fill potential holes in the user-provided package.json file with the normalize function
			const packageJson: IPackageJson = (await this.normalizeFunction({config: {...this.config, skipDependencies: true}, options: userPackage})).config;
			subscriber.onEnd((packageJson));
		});

		// Return the observer
		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				watcher.unobserve();
			}
		};
	}
}