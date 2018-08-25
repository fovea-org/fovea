import {IPostCSS} from "./i-postcss";
import {IPostCSSProcessOptions, PluginConfigurationHook} from "./i-postcss-process-options";
import {IPostCSSProcessResult} from "./i-postcss-process-result";
import postcss, {AcceptedPlugin, Processor} from "postcss";
import {IPostCSSConfiguration} from "./i-postcss-configuration";
import {Json} from "@fovea/common";
import deepExtend from "deep-extend";

/**
 * A class wrapper for PostCSS
 */
export class PostCSS implements IPostCSS {
	/**
	 * The current PostCSS Processor instance
	 * @type {Processor}
	 */
	private postCSSProcessor: Processor;

	constructor (private readonly config: IPostCSSConfiguration) {
	}

	/**
	 * Retrieves a hook that can pass default configuration options to PostCSS plugins
	 * @returns {PluginConfigurationHook}
	 */
	private get defaultPluginOptionsHook (): PluginConfigurationHook {
		return (pluginName) => {
			switch (pluginName) {

				default:
					return null;
			}
		};
	}

	/**
	 * Retrieves a hook that can pass forced configuration options to PostCSS plugins
	 * @returns {PluginConfigurationHook}
	 */
	private get forcedPluginOptionsHook (): PluginConfigurationHook {
		return (pluginName) => {
			switch (pluginName) {

				case "cssnano":
					return {
						autoprefixer: false,
						discardDuplicates: false
					};

				default:
					return null;
			}
		};
	}

	/**
	 * Processes the provided template with the provided options
	 * @param {IPostCSSProcessOptions} options
	 * @returns {Promise<IPostCSSProcessResult>}
	 */
	public async process (options: IPostCSSProcessOptions): Promise<IPostCSSProcessResult> {
		this.preparePostCSSProcessor(options);

		// tslint:disable
		return await this.postCSSProcessor.process(options.template, {from: options.file, to: options.file, syntax: options.syntax});
	}

	/**
	 * Prepares the PostCSSProcessor. It will reuse the existing one if the provided plugins hasn't changed
	 * from a previous compilation
	 * @param {IPostCSSProcessOptions} options
	 */
	private preparePostCSSProcessor (options: IPostCSSProcessOptions): void {
		// Spin up a new processor
		const mergedPlugins = this.mergeUserProvidedPluginsWithDefaults(options);
		this.postCSSProcessor = postcss(mergedPlugins);
	}

	/**
	 * Merges the plugins provided by the user with the default PostCSS plugins used by Fovea
	 * @param {IPostCSSProcessOptions} options
	 * @returns {postcss.AcceptedPlugin[]}
	 */
	private mergeUserProvidedPluginsWithDefaults ({plugins = [], prePlugins = [], isScss, production, pluginConfigurationHook}: IPostCSSProcessOptions): AcceptedPlugin[] {
		return [
			...new Set(
				[
					...prePlugins.map(plugin => this.preparePluginWithHook(plugin, pluginConfigurationHook)),
					...(isScss ? this.config.sassPlugins.map(plugin => this.preparePluginWithHook(plugin, pluginConfigurationHook)) : []),
					...plugins.map(plugin => this.preparePluginWithHook(plugin, pluginConfigurationHook)),
					...this.config.defaultPlugins.map(plugin => this.preparePluginWithHook(plugin, pluginConfigurationHook)),
					...(production ? this.config.defaultProductionPlugins.map(plugin => this.preparePluginWithHook(plugin, pluginConfigurationHook)) : [])
				]
			)
		];
	}

	/**
	 * Gets the name of a Postcss plugin
	 * @param {postcss.AcceptedPlugin} plugin
	 * @returns {string | undefined}
	 */
	private getPluginName (plugin: AcceptedPlugin): string|undefined {
		if ("postcssPlugin" in plugin) return plugin.postcssPlugin;
		try {
			return (<Json>plugin)().postcssPlugin;
		} catch {
			return undefined;
		}

	}

	/**
	 * Returns true if the given Postcss plugin is configurable
	 * @param {AcceptedPlugin} plugin
	 * @returns {boolean}
	 */
	private pluginIsConfigurable (plugin: AcceptedPlugin): boolean {
		return !("postcssPlugin" in plugin);
	}

	/**
	 * Prepares the given plugin, invoking the given hook if provided with one
	 * @param {postcss.AcceptedPlugin} plugin
	 * @param {PluginConfigurationHook} userHook
	 * @returns {postcss.AcceptedPlugin}
	 */
	private preparePluginWithHook (plugin: AcceptedPlugin, userHook?: PluginConfigurationHook): AcceptedPlugin {
		const isConfigurable = this.pluginIsConfigurable(plugin);
		const name = this.getPluginName(plugin);

		// If the plugin name could not be retrieved, or if it is no longer configurable, there is nothing we can do
		if (name == null || !isConfigurable) return plugin;

		// Otherwise, the hook will be able to provide options
		const defaultPluginHookResult = this.defaultPluginOptionsHook(name);
		const userHookResult = userHook == null ? null : userHook(name);
		const forcedPluginHookResult = this.forcedPluginOptionsHook(name);
		return (<Json>plugin)(
			deepExtend(
				defaultPluginHookResult == null ? {} : defaultPluginHookResult,
				userHookResult == null ? {} : userHookResult,
				forcedPluginHookResult == null ? {} : forcedPluginHookResult
			)
		);

	}
}