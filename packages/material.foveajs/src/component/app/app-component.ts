import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {RouteInput, Router, RouterLink, RouterOutlet} from "@fovea/router";
import {routes} from "./app-component-routes";
import {ButtonComponent} from "@fovea/material";
import {config} from "../../config/config";

/**
 * This is the main component for your application
 */
@templateSrc("./app-component.html")
@styleSrc(["../../style/shared.scss", "./app-component.scss"])
@dependsOn(RouterOutlet, RouterLink, ButtonComponent)
export class AppComponent extends HTMLElement {
	/**
	 * The current version of the app
	 * @type {string}
	 */
	@prop public version: string = config.NPM_PACKAGE_VERSION;
	/**
	 * All configured routes
	 * @type {RouteInput[]}
	 */
	@prop public routes: RouteInput[] = routes;

	/**
	 * Invoked when the component is connected
	 */
	protected connectedCallback () {
		// noinspection JSIgnoredPromiseFromCall
		Router.initialize({root: this, routes});
	}
}
