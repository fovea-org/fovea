import {dependsOn, prop, styleSrc, templateSrc} from "@fovea/core";
import {RouteInput, Router, RouterLink, RouterOutlet} from "@fovea/router";
import {routes} from "./app-component-routes";
import {ButtonComponent} from "@fovea/material";

/**
 * This is the main component for your application
 */
@templateSrc("./app-component.html")
@styleSrc(["../../style/shared.scss", "./app-component.scss"])
@dependsOn(RouterOutlet, RouterLink, ButtonComponent)
export class AppComponent extends HTMLElement {
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
