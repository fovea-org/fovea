import {IInstantiatedRoute, Route} from "../../route/route";
import {IRouterOutlet, RouterViewNavigationAction} from "./i-router-outlet";
import {styleSrc} from "@fovea/core";

// tslint:disable:no-any

/**
 * A RouterOutlet is a visual container for IRoutes
 */
@styleSrc(["./router-outlet.scss"])
export class RouterOutlet extends HTMLElement implements IRouterOutlet {

	/**
	 * The initial IInstantiatedRoute, if any
	 * @type {IInstantiatedRoute|null}
	 */
	public initial: IInstantiatedRoute|null = null;

	/**
	 * The previous IInstantiatedRoute, if any
	 * @type {IInstantiatedRoute|null}
	 */
	public previous: IInstantiatedRoute|null = null;

	/**
	 * The current IInstantiatedRoute, if any
	 * @type {IInstantiatedRoute|null}
	 */
	public current: IInstantiatedRoute|null = null;

	/**
	 * Gets the current path of the current route
	 * @type {string|null}
	 */
	public get currentPath (): string|null {
		return this.current == null ? null : this.current.route.path.path;
	}

	/**
	 * Goes back to a previous route
	 * @param {IInstantiatedRoute} route
	 * @returns {Promise<boolean>}
	 */
	public async back (route: IInstantiatedRoute): Promise<boolean> {
		return await this.handleNewRoute(route, "back");
	}

	/**
	 * Goes forward to a future route
	 * @param {IInstantiatedRoute} route
	 * @returns {Promise<boolean>}
	 */
	public async forward (route: IInstantiatedRoute): Promise<boolean> {
		return await this.handleNewRoute(route, "forward");
	}

	/**
	 * Replaces the current route with the given one
	 * @param {IInstantiatedRoute} route
	 * @returns {Promise<boolean>}
	 */
	public async replace (route: IInstantiatedRoute): Promise<boolean> {
		return await this.handleNewRoute(route, "replace");
	}

	/**
	 * Clears the given route, if it exists
	 * @param {Route} route
	 */
	public clearRoute (route: Route): void {

		if (this.current != null && this.current.route.path.path === route.path.path) {
			if (this.current.instance.parentNode != null) {
				if ("destroyedCallback" in this.current.instance) {
					(<any>this.current).instance.destroyedCallback();
				}
				this.current.instance.parentNode.removeChild(this.current.instance);
			}
			this.current = null;
		}

		if (this.previous != null && this.previous.route.path.path === route.path.path) {
			if (this.previous.instance.parentNode != null) {
				if ("destroyedCallback" in this.previous.instance) {
					(<any>this.previous).instance.destroyedCallback();
				}
				this.previous.instance.parentNode.removeChild(this.previous.instance);
			}
			this.previous = null;
		}

		if (this.current == null && this.previous == null) {
			this.initial = null;
		}
	}

	/**
	 * Handles a new route.
	 * @param {IInstantiatedRoute} route
	 * @param {RouterViewNavigationAction} action
	 * @returns {Promise<void>}
	 */
	private async handleNewRoute (route: IInstantiatedRoute, action: RouterViewNavigationAction): Promise<boolean> {
		const isInitial = this.initial == null;

		const previous = this.current;
		this.previous = previous;
		const current = route;
		this.current = current;

		// Set the initial route
		if (this.initial == null) {
			this.initial = current;
		}

		// Invoke the 'onNavigateFrom' and 'onNavigateTo' hooks (if they are defined) and wait for them
		await Promise.all([
			previous == null || previous.instance.onNavigateFrom == null
				? Promise.resolve()
				: previous.instance.onNavigateFrom({action: isInitial ? "replace" : action}),
			current.instance.onNavigateTo == null
				? Promise.resolve()
				: current.instance.onNavigateTo({params: route.state.params, query: route.state.query, action: isInitial ? "replace" : action})
		]);

		if (previous != null && previous.instance.parentNode != null) {
			if ("destroyedCallback" in previous.instance) {
				(<any>previous).instance.destroyedCallback();
			}
			previous.instance.parentNode.removeChild(previous.instance);
		}

		// If the current route has changed in the meantime, remove the current route immediately
		if (current !== this.current && current.instance.parentNode != null) {
			if ("destroyedCallback" in current.instance) {
				(<any>current).instance.destroyedCallback();
			}
			current.instance.parentNode.removeChild(current.instance);
		}

		return true;
	}
}