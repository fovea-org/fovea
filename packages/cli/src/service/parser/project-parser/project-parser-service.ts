import {IProjectParserService} from "./i-project-parser-service";
import {IProjectParserServiceOptions} from "./i-project-parser-service-options";
import {IProject} from "./i-project";
import {IConfigParserService} from "../config-parser/i-config-parser-service";
import {IPackageJsonParserService} from "../package-json-parser/i-package-json-parser-service";
import {IProjectPathUtil} from "../../../util/project-path-util/i-project-path-util";
import {IPackageJson} from "../../../package-json/i-package-json";
import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IHasherService} from "../../hasher/i-hasher-service";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";

/**
 * A class that helps with retrieving things that are relevant to the configuration of a Fovea project
 */
export class ProjectParserService implements IProjectParserService {

	constructor (private readonly configParser: IConfigParserService,
							 private readonly packageJsonParser: IPackageJsonParserService,
							 private readonly projectPathUtil: IProjectPathUtil,
							 private readonly hasherService: IHasherService) {
	}

	/**
	 * Retrieves the IFoveaCliConfig for a project as well as its' root
	 * @param {IProjectParserServiceOptions} options
	 * @param {ISubscriber<IProject>} subscriber
	 * @returns {IObserver}
	 */
	public parse ({config, watch}: IProjectParserServiceOptions, subscriber: ISubscriber<IProject>): IObserver {
		let foveaCliConfigObserver: IObserver|null = null;
		let packageJsonObserver: IObserver|null = null;

		(async () => {
			let packageJson: IPackageJson|null;
			let foveaCliConfig: IFoveaCliConfig|null;
			const root = await this.projectPathUtil.findProjectRoot(config);
			const hash = this.hasherService.generate();

			// Subscribe to changes to the package.json file
			packageJsonObserver = this.packageJsonParser.parse(
				{path: this.projectPathUtil.getPathFromProjectRoot(root, "package.json"), watch},
				{
					onError: subscriber.onError,
					onStart: subscriber.onStart,
					onEnd: newPackageJson => {
						packageJson = newPackageJson;
						this.onProjectUpdated(root, hash, foveaCliConfig, packageJson, subscriber);

						// Remove any existing observer for the fovea-cli.config
						if (foveaCliConfigObserver != null) foveaCliConfigObserver.unobserve();

						// Subscribe to changes to the fovea-cli.config file
						foveaCliConfigObserver = this.configParser.parse(
							{packageJson, watch, root, path: this.projectPathUtil.getPathFromProjectRoot(root, config)},
							{
								onError: subscriber.onError,
								onStart: subscriber.onStart,
								onEnd: newFoveaCliConfig => {
									foveaCliConfig = newFoveaCliConfig.result;
									this.onProjectUpdated(root, hash, foveaCliConfig, packageJson, subscriber);
								}
							}
						);
					}
				}
			);
		})();

		return {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (packageJsonObserver != null) {
					packageJsonObserver.unobserve();
				}

				if (foveaCliConfigObserver != null) {
					foveaCliConfigObserver.unobserve();
				}
			}
		};
	}

	/**
	 * Called each time something within the project is updated
	 * @param {string} root
	 * @param {string} hash
	 * @param {IFoveaCliConfig | null} foveaCliConfig
	 * @param {IPackageJson | null} packageJson
	 * @param {ISubscriber<IProject>} subscriber
	 */
	private onProjectUpdated (root: string, hash: string, foveaCliConfig: IFoveaCliConfig|null, packageJson: IPackageJson|null, subscriber: ISubscriber<IProject>): void {
		if (foveaCliConfig == null || packageJson == null) return;
		subscriber.onEnd({
			root,
			foveaCliConfig,
			packageJson,
			hash
		});
	}
}