import {ITemplateGenerator} from "./i-template-generator";
import {ICreateTaskExecuteOptions} from "../../../task/create-task/i-create-task-execute-options";
import {TemplateFile, TemplateFileKind} from "./template-file";
import {Generator} from "../generator";
import {IBuildConfig} from "../../../build-config/i-build-config";
import {IFormatter} from "../../../formatter/i-formatter";
import {capitalize} from "@wessberg/stringutil";

/**
 * A class that helps with generating the fovea-cli config file
 */
export class TemplateGenerator extends Generator implements ITemplateGenerator {

	constructor (private readonly config: IBuildConfig,
							 private readonly formatter: IFormatter) {
		super();
	}

	/**
	 * Gets the selector for the root component
	 * @returns {string}
	 */
	private get rootComponentSelector (): string {
		return `${this.config.rootComponentName}-${this.config.componentName}`;
	}

	/**
	 * Gets the selector for the Home component
	 * @returns {string}
	 */
	private get homeComponentSelector (): string {
		return `${this.config.homeComponentName}-${this.config.componentName}`;
	}

	/**
	 * Gets the class name for the root component
	 * @returns {string}
	 */
	private get rootComponentClassName (): string {
		return `${capitalize(this.config.rootComponentName)}${capitalize(this.config.componentName)}`;
	}

	/**
	 * Gets the class name for the Home component
	 * @returns {string}
	 */
	private get homeComponentClassName (): string {
		return `${capitalize(this.config.homeComponentName)}${capitalize(this.config.componentName)}`;
	}

	/**
	 * Generates the project template
	 * @param {ICreateTaskExecuteOptions} options
	 * @returns {Promise<string>}
	 */
	public async onGenerate (options: ICreateTaskExecuteOptions): Promise<TemplateFile[]> {
		switch (options.template) {
			case "standard":
				return this.generateStandardTemplate();
		}
	}

	/**
	 * Generates a standard template
	 * @returns {TemplateFile[]}
	 */
	private generateStandardTemplate (): TemplateFile[] {
		return [
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/${this.config.componentName}`,
				children: [
					{
						kind: TemplateFileKind.DIRECTORY,
						name: this.config.rootComponentName,
						children: [
							{
								kind: TemplateFileKind.FILE,
								name: this.rootComponentSelector,
								extension: this.config.defaultScriptExtension,
								content: this.formatter.format(`
								import {styleSrc, templateSrc, dependsOn} from "@fovea/core";
								import {Router, IRouter, RouterOutlet} from "@fovea/router";
								import {routes} from "./${this.rootComponentSelector}-routes";

								/**
								 * This is the main ${this.config.componentName} for your application
								 */
								@templateSrc("./${this.rootComponentSelector}.${this.config.defaultXMLScriptExtension}")
								@styleSrc(["../../style/${this.config.sharedStylesName}.${this.config.defaultCssExtension}", "./${this.rootComponentSelector}.${this.config.defaultCssExtension}"])
								@dependsOn(RouterOutlet)
								export class ${this.rootComponentClassName} extends HTMLElement {
									private router: IRouter;

									connectedCallback () {
										this.router = new Router({ root: this, routes });
									}
								}
								`, {...this.config.formatOptions, parser: "typescript"})
							},
							{
								kind: TemplateFileKind.FILE,
								name: `${this.rootComponentSelector}-routes`,
								extension: "ts",
								content: this.formatter.format(`
								import {RouteInput} from "@fovea/router";

								export const routes: RouteInput[] = [
									{
										path: "/",
										name: "home",
										component: () => import("../home/home-component")
									}
								];
								`, {...this.config.formatOptions, parser: "typescript"})
							},
							{
								kind: TemplateFileKind.FILE,
								name: this.rootComponentSelector,
								extension: this.config.defaultXMLScriptExtension,
								content: this.formatter.format(`\
								<h1>Welcome to your app</h1>
								<p>Happy coding!</p>
								<p>Here's a few links you may need while building your application:</p>
								<ul>
									<li><a href="https://github.com/fovea-org/fovea/blob/master/packages/cli/README.md">CLI documentation</a></li>
									<li><a href="https://github.com/fovea-org/fovea/blob/master/packages/router/README.md">Router documentation</a></li>
									<li><a href="https://github.com/fovea-org/fovea/issues">Issues</a></li>
									<li><a href="https://stackoverflow.com/search?q=fovea">Stack Overflow</a></li>
								</ul>

								<!-- Matched routes will be injected here -->
								<router-outlet></router-outlet>
								`, {...this.config.formatOptions, parser: "html"})
							},
							{
								kind: TemplateFileKind.FILE,
								name: this.rootComponentSelector,
								extension: this.config.defaultCssExtension,
								content: this.formatter.format(`
									@import "../../style/${this.config.baseStylesName}";

									:host {
										padding: 0 20px;
										display: block;
									}
								`, {...this.config.formatOptions, parser: this.config.defaultCssExtension})
							}
						]
					},
					{
						kind: TemplateFileKind.DIRECTORY,
						name: this.config.homeComponentName,
						children: [
							{
								kind: TemplateFileKind.FILE,
								name: this.homeComponentSelector,
								extension: this.config.defaultScriptExtension,
								content: this.formatter.format(`
								import {styleSrc, templateSrc} from "@fovea/core";
								import {IRouterTarget} from "@fovea/router";

								/**
								 * This component represents the ${capitalize(this.config.rootComponentName)} route of your application
								 */
								@templateSrc("./${this.homeComponentSelector}.${this.config.defaultXMLScriptExtension}")
								@styleSrc(["../../style/${this.config.sharedStylesName}.${this.config.defaultCssExtension}", "./${this.homeComponentSelector}.${this.config.defaultCssExtension}"])
								export default class ${this.homeComponentClassName} extends HTMLElement implements IRouterTarget {
								}
								`, {...this.config.formatOptions, parser: "typescript"})
							},
							{
								kind: TemplateFileKind.FILE,
								name: this.homeComponentSelector,
								extension: this.config.defaultXMLScriptExtension,
								content: this.formatter.format(`\
								<h2>This is the ${this.config.homeComponentName} route</h2>
								`, {...this.config.formatOptions, parser: "html"})
							},
							{
								kind: TemplateFileKind.FILE,
								name: this.homeComponentSelector,
								extension: this.config.defaultCssExtension,
								content: this.formatter.format(`
									@import "../../style/${this.config.baseStylesName}";
								`, {...this.config.formatOptions, parser: this.config.defaultCssExtension})
							}
						]
					}
				]
			},
			{
				kind: TemplateFileKind.FILE,
				name: `${this.config.srcFolderName}/${this.config.entryName}`,
				extension: this.config.defaultScriptExtension,
				content: this.formatter.format(`
				// Import the ${this.rootComponentClassName}, the base ${this.config.componentName} for the App
				import {${this.rootComponentClassName}} from "./${this.config.componentName}/${this.config.rootComponentName}/${this.rootComponentSelector}";
				// Import the ServiceWorker registration function
				import {${this.config.serviceWorkerRegisterFunctionName}} from "./${this.config.serviceWorkerFolderName}/${this.config.serviceWorkerRegisterName}";

				/**
 				 * Append the ${this.rootComponentClassName} to the DOM.
 				 */
 				 document.body.appendChild(new ${this.rootComponentClassName}());

 				 /**
 				  * Register a ServiceWorker
 				  */
 				  ${this.config.serviceWorkerRegisterFunctionName}();
				`, {...this.config.formatOptions, parser: "typescript"})
			},
			{
				kind: TemplateFileKind.DIRECTORY,
				name: `${this.config.srcFolderName}/${this.config.serviceWorkerFolderName}`,
				children: [
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						// This file contains the service worker content for your app

						// Load the Workbox configuration for the app
						import "./${this.config.serviceWorkerWorkboxName}";
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerCleanupName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						/**
						 * Wipes all content of CacheStorage
						 * @returns {Promise<void>}
						 */
						export async function wipeCaches (): Promise<void> {
							const keys = await caches.keys();
							await Promise.all(keys.map(key => caches.delete(key)));
						}
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerWorkboxInitializeName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						/// <reference path="./${this.config.serviceWorkerWorkboxSWName}.d.${this.config.defaultScriptExtension}" />
						// This file will initialize Workbox
						import {config} from "../config/config";
						import {wipeCaches} from "./${this.config.serviceWorkerCleanupName}";

						// Wipe all Cache Storage caches
						wipeCaches();

						// Load Workbox
						importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

						// Set the workbox environment
						workbox.setConfig({debug: config.DEVELOPMENT});
						// Set the log level to silent
						workbox.core.setLogLevel(4);

						// Activate the new ServiceWorker immediately and claim clients
						workbox.skipWaiting();
						workbox.clientsClaim();

						// Set the name of the cache
						workbox.core.setCacheNameDetails({
							precache: \`precache-\${config.TAG}-\${config.HASH}\`,
							runtime: \`runtime-\${config.TAG}-\${config.HASH}\`
						});
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerRoutingName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						/// <reference path="./${this.config.serviceWorkerWorkboxSWName}.d.${this.config.defaultScriptExtension}" />
						// This file contains the Workbox routing configuration for your app

						// Load the config
						import {config} from "../config/config";

						// Serve index from the network first
						workbox.routing.registerRoute(
							({url}) => url.pathname === "/",
							workbox.strategies.networkFirst({})
						);

						// Serve every other resource from the cache only
						workbox.routing.registerRoute(
							({url}) => url.pathname !== "/",
							config.WATCH
								? workbox.strategies.networkFirst({})
								// Always use the cache first when not in WATCH mode
								: workbox.strategies.cacheFirst({})
						);
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerPrecachingName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						/// <reference path="./${this.config.serviceWorkerWorkboxSWName}.d.${this.config.defaultScriptExtension}" />
						// This file contains the Workbox precaching configuration for your app
						import {config} from "../config/config";

						// Precache and serve each route
						workbox.precaching.precacheAndRoute([
							config.RESOURCE.output.manifestJson,
							...Object.values(config.RESOURCE.output.chunk),
							...Object.values(config.RESOURCE.output.asset.appIcon),
							...Object.values(config.RESOURCE.output.asset.other)
						]);
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerWorkboxName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						/// <reference path="./${this.config.serviceWorkerWorkboxSWName}.d.${this.config.defaultScriptExtension}" />
						// This file contains the Workbox configuration for your app

						// Initialize Workbox
						import "./${this.config.serviceWorkerWorkboxInitializeName}";

						// Prepare routing
						import "./${this.config.serviceWorkerRoutingName}";

						// Prepare precaching
						import "./${this.config.serviceWorkerPrecachingName}";
				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: `${this.config.serviceWorkerWorkboxSWName}.d`,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						// Declare workbox as a global
						declare const workbox: typeof import("workbox-sw").default;

				`, {...this.config.formatOptions, parser: "typescript"})
					},
					{
						kind: TemplateFileKind.FILE,
						name: this.config.serviceWorkerRegisterName,
						extension: this.config.defaultScriptExtension,
						content: this.formatter.format(`
						// This file will register a ServiceWorker
						import {config} from "../config/config";

						/**
						 * Registers a ServiceWorker if the environment supports it
						 */
						export async function ${this.config.serviceWorkerRegisterFunctionName} (): Promise<void> {
							if ("serviceWorker" in navigator) {
									await window.navigator.serviceWorker.register(config.RESOURCE.output.chunk.serviceWorker);
								}
						}

				`, {...this.config.formatOptions, parser: "typescript"})
					}
				]
			}
		];
	}
}