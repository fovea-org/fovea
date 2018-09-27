import {IAliasRoute, IInstantiatedRoute, IRedirectRoute, IStandardRoute, Route, RouteComponent, RouteInput, RouteInstanceConstructor} from "../route/route";
import {SessionHistory} from "../session-history/session-history";
import {ISessionHistory} from "../session-history/i-session-history";
import {IStateObserver} from "../session-history/i-state-observer";
import {IState, IStateInput} from "../state/i-state";
import {Path} from "path-parser";
import {IRouteMatch} from "../route/i-route-match";
import {ensureLeadingButNoTrailingSlash} from "../util/path-util";
import {IRouterOutlet, RouterViewNavigationAction} from "./router-outlet/i-router-outlet";
import {IRouterOptions} from "./i-router-options";
import {IRouterTarget} from "../route/i-router-target";
import {RouterPushOptions} from "./router-push-options";
import {normalizeParams, normalizeQueryParams} from "../util/query-util";
import {IParams} from "../query/i-params";
import {IDeepResolveResolveAliasValueMapper} from "./i-deep-resolve-result";
import {RouteGuard} from "../route/route-guard";
import {rafScheduler} from "@fovea/scheduler";

// tslint:disable:no-any

/**
 * This is the Router that handles all navigation
 */
export class Router {
	/**
	 * Holds true if Router.initialize() has been invoked
	 * @type {boolean}
	 */
	public static initialized: boolean = false;

	/**
	 * The user-provided routes
	 * @type {IStandardRouteInput[]}
	 */
	private static readonly routes: Route[] = [];

	/**
	 * A reference to the session history to use
	 * @type {SessionHistory}
	 */
	private static readonly sessionHistory: ISessionHistory = new SessionHistory({router: Router});

	/**
	 * A subscriber for navigation to a past state
	 * @type {IStateObserver}
	 */
	private static readonly pastStateSubscriber: IStateObserver = Router.sessionHistory.onPastState(Router.onPastState.bind(Router));

	/**
	 * A subscriber for navigation to a future state
	 * @type {IStateObserver}
	 */
	private static readonly futureStateSubscriber: IStateObserver = Router.sessionHistory.onFutureState(Router.onFutureState.bind(Router));

	/**
	 * A map between IRoutes and IRouteInstances
	 * @type {Map<string, IRouterTarget>}
	 */
	private static readonly pathToInstantiatedRouteMap: Map<string, IInstantiatedRoute> = new Map();

	/**
	 * The Set of paths that is currently instantiated
	 * @type {Set<string>}
	 */
	private static readonly instantiatedPaths: Set<string> = new Set();

	/**
	 * The root HTMLElement in which to look for a RouterOutlet
	 * @type {HTMLElement}
	 */
	private static root: HTMLElement;

	/**
	 * The guards that will be checked for every state change, no matter the route
	 * @type {RouteGuard[]?}
	 */
	private static globalGuards: RouteGuard[]|undefined;

	/**
	 * The paths that are currently being matched for routes
	 * @type {Set<string>|null>}
	 */
	private static currentPaths: Set<string>|null = null;

	/**
	 * A cache for the paths that fits names
	 * @type {Map<string, string>}
	 */
	private static readonly nameToPathMap: Map<string, string> = new Map();

	private constructor () {}

	/**
	 * Gets the size of the session history
	 */
	public static get size (): number {
		return this.sessionHistory.length;
	}

	/**
	 * Adds all of the given routes
	 * @param {RouteInput[]} routes
	 */
	public static addRoutes (routes: RouteInput[]): void {
		this.routes.push(...this.convertRouteInputsToRoutes(routes));
	}

	/**
	 * Invoked when the Router is disposed
	 */
	public static dispose (): void {
		this.pastStateSubscriber.unobserve();
		this.futureStateSubscriber.unobserve();
		this.clearRoutes();
	}

	/**
	 * Pops the current state
	 */
	public static pop (): void {
		this.sessionHistory.pop();
	}

	/**
	 * Pushes a new State
	 * @param {RouterPushOptions} options
	 * @returns {Promise<void>}
	 */
	public static async push (options: RouterPushOptions): Promise<boolean> {
		const {route, stateInput} = this.parsePushOptions(options);

		// Check if any route blocks this change and return false if that is the case
		const checkGuardsResult = await this.checkGuards(route, stateInput);
		if (checkGuardsResult === false) return false;
		// If a different route was returned, navigate to that one instead
		if (checkGuardsResult !== true) return await this.push(checkGuardsResult);

		// Otherwise, push the route
		this.sessionHistory.push(stateInput);
		return true;
	}

	/**
	 * Replaces the current state with the given one
	 * @param {RouterPushOptions} options
	 * @returns {Promise<void>}
	 */
	public static async replace (options: RouterPushOptions): Promise<boolean> {
		const {route, stateInput} = this.parsePushOptions(options);

		// Check if any route blocks this change and return false if that is the case
		const checkGuardsResult = await this.checkGuards(route, stateInput);
		if (checkGuardsResult === false) return false;
		// If a different route was returned, navigate to that one instead
		if (checkGuardsResult !== true) return await this.replace(checkGuardsResult);

		// Otherwise, push the route
		this.sessionHistory.replace(stateInput);
		return true;
	}

	/**
	 * Takes the given amount of steps forward or backward in the history stack
	 * @param {number} n
	 */
	public static go (n: number): void {
		this.sessionHistory.go(n);
	}

	/**
	 * Returns true if any route is blocked by guards
	 * @param {Route} route
	 * @param {IStateInput} stateInput
	 * @returns {Promise<boolean|RouterPushOptions>}
	 */
	private static async checkGuards (route: Route, stateInput: IStateInput): Promise<boolean|RouterPushOptions> {
		const parentChain = this.getParentToChildArrayFromRoute(route);

		// Walk through each route from the parent and down
		for (const currentRoute of parentChain) {

			// Merge all global guards with the guards for this specific route
			const mergedGuards = [
				...(this.globalGuards != null ? this.globalGuards : []),
				...("guards" in currentRoute && currentRoute.guards != null ? currentRoute.guards : [])
			];

			// Check all guards
			for (const guard of mergedGuards) {
				const guardResult = await guard(stateInput, this.sessionHistory.current);
				// If any guard fails, return true
				if (guardResult === false) {
					return false;
				}

				// If a different route is returned, use that instead
				else if (guardResult !== true) {
					return guardResult;
				}
			}
		}
		// All guard checks were okay!
		return true;
	}

	/**
	 * Attempts to parse the initial route based on the URL
	 * @returns {RouterPushOptions}
	 */
	public static parseInitialRouteFromURL (): RouterPushOptions {
		const url = new URL(location.toString());
		return {
			path: url.pathname,
			title: document.title,
			query: normalizeQueryParams(url)
		};
	}

	/**
	 * Initializes the router by adding the initial state
	 * @param {IRouterOptions} options
	 */
	public static async initialize (options: IRouterOptions): Promise<void> {
		this.initialized = true;
		this.root = options.root;
		this.globalGuards = options.guards;
		this.addRoutes(options.routes);

		// Parse the initial route from the URL
		const baseOptions = this.parseInitialRouteFromURL();

		// If it fails, redirect to the home route, but preserve the query parameters
		const fallback = async () => await this.replace({...baseOptions, path: "/", params: {}});

		// Attempt to parse a route from it
		try {
			const result = await this.replace(baseOptions);
			if (!result) await fallback();
		} catch {
			await fallback();
		}
	}

	/**
	 * Gets a path in which the given params are replaced in it
	 * @param {string} path
	 * @param {IParams} params
	 */
	private static getPathWithParams (path: string, params: IParams): string {
		Object.entries(params).forEach(([paramName, paramValue]) => {
			path = path.replace(new RegExp(`:${paramName}`, "g"), String(paramValue));
		});
		return path;
	}

	/**
	 * Gets an IStateInput dictionary based on the given options
	 * @param {RouterPushOptions} options
	 * @returns {object}
	 */
	private static parsePushOptions (options: RouterPushOptions): { stateInput: IStateInput; route: IStandardRoute|IAliasRoute } {

		const matchingRoute = "path" in options ? this.deepResolveRoute("path", options.path) : this.deepResolveRoute("name", options.name, options.params);
		if (matchingRoute == null) throw new ReferenceError(`No route had a ${"path" in options ? "path" : "name"} that matched the given one: '${"path" in options ? options.path : options.name}'`);

		let params: IParams = matchingRoute.params;
		let rawPathParams: IParams|undefined;

		// Also check the given path for params
		if ("path" in options) {
			const paramMatch = matchingRoute.route.path.test(options.path);
			if (paramMatch != null) {
				rawPathParams = normalizeParams(<{ [key: string]: string }> paramMatch);
			}
		}

		else {
			rawPathParams = options.params;
		}

		// Merge them with the params for the route
		if (rawPathParams != null) {
			params = {...rawPathParams, ...params};
		}

		return {
			stateInput: {
				query: options.query == null ? {} : normalizeQueryParams(options.query),
				title: options.title != null ? options.title : document.title,
				path: new Path(matchingRoute.route.path.build(params)).path,
				params
			},
			route: matchingRoute.route
		};
	}

	/**
	 * Converts the given RouteInputs to proper Routes
	 * @param {RouteInput} routeInputs
	 * @param {string} accumulatedPath,
	 * @param {IStandardRoute} [parent]
	 */
	private static convertRouteInputsToRoutes (routeInputs: RouteInput[], accumulatedPath: string = "", parent?: IStandardRoute): Route[] {
		return routeInputs.map(routeInput => {

			const newPath = `${ensureLeadingButNoTrailingSlash(accumulatedPath)}${ensureLeadingButNoTrailingSlash(routeInput.path)}`;
			const normalizedRoute: Route = "redirect" in routeInput || "alias" in routeInput ? {
				...routeInput,
				parent,
				path: new Path(newPath === "" ? "/" : newPath)
			} : {
				...routeInput,
				parent,
				path: new Path(newPath === "" ? "/" : newPath),
				children: []
			};

			// If the route has a name, map it to the path
			if (routeInput.name != null) {
				this.nameToPathMap.set(routeInput.name, normalizedRoute.path.path);
			}

			if ("children" in normalizedRoute && "children" in routeInput && routeInput.children != null) {
				normalizedRoute.children = this.convertRouteInputsToRoutes(routeInput.children, normalizedRoute.path.path, normalizedRoute);
			}
			return normalizedRoute;
		});
	}

	/**
	 * Matches a route for the given state
	 * @param {IState} state
	 * @returns {IRouteMatch|null}
	 */
	private static findMatchingRouteForState (state: IState): IRouteMatch|null {
		for (const route of this.routes) {
			const matchedRoute = this.getTestMatchPathOnRoute(route, state, state.path);
			if (matchedRoute != null) {
				return matchedRoute;
			}
		}
		return null;
	}

	/**
	 * Returns true if the given route is a redirect route
	 * @param {Route} route
	 * @returns {boolean}
	 */
	private static isRedirectRoute (route: Route): route is IRedirectRoute {
		return "redirect" in route;
	}

	/**
	 * Returns true if the given route is an alias route
	 * @param {Route} route
	 * @returns {boolean}
	 */
	private static isAliasRoute (route: Route): route is IAliasRoute {
		return "alias" in route;
	}

	/**
	 * Finds the route that matches the given path
	 * @param {string} property
	 * @param {string} propertyValue
	 * @param {IParams} [params]
	 * @param {boolean} [resolveAlias]
	 * @returns {IStandardRoute|IAliasRoute|null}
	 */
	private static deepResolveRoute<T extends keyof IDeepResolveResolveAliasValueMapper> (property: "name"|"path", propertyValue: string, params: IParams = {}, resolveAlias: T = <T>"false"): IDeepResolveResolveAliasValueMapper[T]|null {

		const paramDicts: IParams[] = [params];

		const recursiveStep = (currentProperty: keyof Route, currentPropertyValue: string, routes: Route[] = this.routes): IStandardRoute|IAliasRoute|null => {
			for (const route of routes) {
				let resolvedRoute = route;

				const routeIsMatched = currentProperty === "path" ? resolvedRoute.path.test(currentPropertyValue) != null : resolvedRoute[currentProperty] === currentPropertyValue;
				if (routeIsMatched) {

					// Follow redirects and aliases if allowed
					if (this.isRedirectRoute(resolvedRoute) || this.isAliasRoute(resolvedRoute)) {
						const referencePropertyValue = this.isRedirectRoute(resolvedRoute) ? resolvedRoute.redirect : resolvedRoute.alias;

						if ("params" in referencePropertyValue && referencePropertyValue.params != null) {
							paramDicts.unshift(referencePropertyValue.params);
						}
						if (!("alias" in resolvedRoute) || resolveAlias === "true") {
							const redirectedRoute = "path" in referencePropertyValue ? recursiveStep("path", referencePropertyValue.path, routes) : recursiveStep("name", referencePropertyValue.name, routes);
							if (redirectedRoute == null) throw new ReferenceError(`The route with path: '${resolvedRoute.path}' ${"redirect" in resolvedRoute ? "redirects to" : "aliases the"} ${"path" in referencePropertyValue ? `the path: '${referencePropertyValue.path}'` : `the name: '${referencePropertyValue.name}'`}, but it wasn't configured in the router`);
							resolvedRoute = redirectedRoute;
						}
					}

					return resolvedRoute;
				}

				// Also check its' children unless the current route is a redirect
				if ("children" in route) {
					const childMatch = recursiveStep(currentProperty, currentPropertyValue, route.children);
					if (childMatch != null) {
						return childMatch;
					}
				}
			}

			// Fall back to returning null
			return null;
		};

		// Perform the recursive step
		const result = recursiveStep(property, propertyValue);
		let normalizedParams: IParams = {};

		// Normalize the params in their natural order
		paramDicts.forEach(dict => normalizedParams = {...normalizedParams, ...dict});

		return result == null ? null : <IDeepResolveResolveAliasValueMapper[T]> {
			route: {
				...result,
				path: new Path(this.getPathWithParams(result.path.path, normalizedParams))
			},
			params: normalizedParams
		};
	}

	/**
	 * Returns true if the given RouteConfig matches the given state
	 * @param {Route} route
	 * @param {IState} state
	 * @param {string} path
	 * @returns {IRouteMatch|null}
	 */
	private static getTestMatchPathOnRoute (route: Route, state: IState, path: string): IRouteMatch|null {

		const testRoute = (routeToTest: Route): IRouteMatch|null => {
			// Test if the combined raw path is matched on the path
			const match = routeToTest.path.test(path);

			// If it is, return this route as well as the matched data
			if (match != null) {
				// If this is a redirect, resolve the route it references
				if ("alias" in routeToTest || "redirect" in routeToTest) {
					const referencePropertyValue = "redirect" in routeToTest ? routeToTest.redirect : routeToTest.alias;
					const resolvedResult = "path" in referencePropertyValue
						? this.deepResolveRoute("path", referencePropertyValue.path, state.params, "true")
						: this.deepResolveRoute("name", referencePropertyValue.name, {...referencePropertyValue.params, ...state.params}, "true");

					// If no route matches the route referenced by the redirect, return null
					if (resolvedResult == null) return null;

					return {
						state: {
							...state,
							params: resolvedResult.params,
							query: state.query
						},
						route: resolvedResult.route
					};
				}

				// If this is NOT a redirect, normalize the matched route
				return {
					state: {
						...state,
						params: {...normalizeParams(<{ [key: string]: string }>match), ...state.params},
						query: state.query
					},
					route: routeToTest
				};
			}

			return null;
		};

		let parentMatch = testRoute(route);
		if (parentMatch != null) return parentMatch;

		if ("children" in route) {
			for (const child of route.children) {
				parentMatch = this.getTestMatchPathOnRoute(child, state, path);
				if (parentMatch != null) return {...parentMatch};
			}
		}

		// Fall back to returning null
		return null;
	}

	/**
	 * Called when navigation happens to a past state
	 * @param state
	 */
	private static onPastState (state: IState): void {
		rafScheduler.mutate(() => this.updateRouterView(state, "back").then(), {instantIfFlushing: true});
	}

	/**
	 * Called when navigation happens to a future state
	 * @param state
	 */
	private static onFutureState (state: IState): void {
		rafScheduler.mutate(() => this.updateRouterView(state, "forward").then(), {instantIfFlushing: true});
	}

	/**
	 * Gets the IRouterOutlet for the given element
	 * @param {IRouterOutlet} element
	 */
	private static getRouterOutletForElement (element: HTMLElement): IRouterOutlet {
		const queryRoot = element.shadowRoot != null ? element.shadowRoot : element;
		const routerOutlet = <IRouterOutlet> queryRoot.querySelector("router-outlet");
		if (routerOutlet == null) throw new ReferenceError(`${this.constructor.name} could not find a <router-outlet> element within the root of the element: '${element.nodeName.toLowerCase()}'`);
		return routerOutlet;
	}

	/**
	 * Gets the RouterOutlet that matches the given route
	 * @param {Route} route
	 * @param {string} instantiatedRouteIdentifier
	 */
	private static getRouterOutletForRoute (route: Route, instantiatedRouteIdentifier: string): IRouterOutlet {
		// Get the IRouterOutlet that matches this route
		let rootElement: HTMLElement|null = null;
		// This route has no parent. It is a root route!
		if (route.parent == null) rootElement = this.root;
		else {
			const ownState = this.pathToInstantiatedRouteMap.get(instantiatedRouteIdentifier)!;
			const parentInstantiatedRouteIdentifier = this.getPathWithParams(route.parent.path.path, ownState.state.params);
			const instantiatedRoute = this.pathToInstantiatedRouteMap.get(parentInstantiatedRouteIdentifier);
			if (instantiatedRoute != null) rootElement = instantiatedRoute.instance;
		}

		if (rootElement == null) throw new ReferenceError(`${this.constructor.name} could not find a root element for the route: '${route.path.path}'`);
		return this.getRouterOutletForElement(rootElement);
	}

	/**
	 * Returns true if the given RouteComponent is sync (e.g. not lazily evaluated)
	 * @param {RouteComponent} ctor
	 */
	private static routeComponentIsSync (ctor: RouteComponent): ctor is RouteInstanceConstructor {
		if (typeof ctor === "object") return false;
		return HTMLElement.prototype.isPrototypeOf(ctor.prototype);
	}

	/**
	 * Gets a new instance of a RouteComponent
	 * @param {RouteComponent} ctor
	 */
	private static async getNewRouteInstanceFromRouteComponent (ctor: RouteComponent): Promise<IRouterTarget> {

		if (this.routeComponentIsSync(ctor)) {
			return new ctor();
		}

		const module = typeof ctor === "object" ? await ctor : await ctor();
		if ("default" in module) {
			return new module.default();
		} else {
			// Otherwise, the component itself were declared
			return new module();
		}
	}

	/**
	 * Builds up an ordered array of the routes in order from parent to child
	 * @param {T} route
	 * @returns {T[]}
	 */
	private static getParentToChildArrayFromRoute<T extends Route> (route: T): T[] {
		const parentChain: T[] = [];

		// Walk up the parent tree and instantiate all components from the matched route
		let currentRoute: T|undefined = route;
		while (currentRoute != null) {
			parentChain.unshift(currentRoute);
			currentRoute = <T> currentRoute.parent;
		}
		return parentChain;
	}

	/**
	 * Updates a RouterOutlet
	 * @param state
	 * @param navigationAction
	 */
	private static async updateRouterView (state: IState, navigationAction: RouterViewNavigationAction): Promise<void> {
		const matchingRoute = this.findMatchingRouteForState(state);
		if (matchingRoute == null) return;

		// Build up an ordered array of the routes in order from parent to child
		const parentChain = this.getParentToChildArrayFromRoute(matchingRoute.route);

		const currentPaths: Set<string> = new Set();
		this.currentPaths = currentPaths;
		const promises: Promise<boolean>[] = [];

		for (const route of parentChain) {
			const instantiatedPathIdentifier = this.getPathWithParams(route.path.path, matchingRoute.state.params);
			currentPaths.add(instantiatedPathIdentifier);
			this.instantiatedPaths.add(instantiatedPathIdentifier);

			const existingInstance = this.pathToInstantiatedRouteMap.get(instantiatedPathIdentifier);
			if (existingInstance != null) continue;

			const instantiatedRoute: IInstantiatedRoute = {
				...matchingRoute,
				route,
				instance: await this.getNewRouteInstanceFromRouteComponent(route.component)
			};

			this.pathToInstantiatedRouteMap.set(instantiatedPathIdentifier, instantiatedRoute);

			// Get the IRouterOutlet that matches this route
			try {
				const routerOutletForRoute = this.getRouterOutletForRoute(route, instantiatedPathIdentifier);
				const routerOutletRoot = routerOutletForRoute.shadowRoot != null ? routerOutletForRoute.shadowRoot : routerOutletForRoute;

				// Append the instance immediately since it won't otherwise have any children, including any <router-outlet> it may require
				routerOutletRoot.appendChild(instantiatedRoute.instance);
				promises.push(routerOutletForRoute[navigationAction](instantiatedRoute));
			} catch (ex) {
				// Additional navigation has happened in the meantime. This is OK
			}
		}

		// Extract all the paths to delete
		const pathsToDelete = [...this.instantiatedPaths].filter(instantiatedPath => !currentPaths.has(instantiatedPath));
		// Take all those instances and remove them from their respective maps
		const poppedInstances = <[IInstantiatedRoute, string][]> pathsToDelete.map(path => {
			this.instantiatedPaths.delete(path);

			const instance = this.pathToInstantiatedRouteMap.get(path);
			this.pathToInstantiatedRouteMap.delete(path);
			return [instance, path];
		}).filter(([poppedInstance]) => poppedInstance != null);

		// Wait for all the promises to complete before proceeding
		await Promise.all(promises);

		for (const [poppedInstance, poppedPath] of poppedInstances) {
			// If the method has been invoked again in the meantime and the path of the poppedInstance is
			// undergoing re-stamping to the DOM, do nothing
			if (this.currentPaths != null && this.currentPaths.has(poppedPath)) {
				continue;
			}

			rafScheduler.mutate(() => {
				// Otherwise remove the instance
				if (poppedInstance.instance.parentNode != null) {
					if ("destroyedCallback" in poppedInstance.instance) {
						(<any>poppedInstance).instance.destroyedCallback();
					}
					poppedInstance.instance.parentNode.removeChild(poppedInstance.instance);
				}
			}, {instantIfFlushing: true});
		}
	}

	/**
	 * Clears all routes
	 */
	private static clearRoutes (): void {

		for (const path of this.instantiatedPaths) {
			this.instantiatedPaths.delete(path);
			const instantiatedRoute = this.pathToInstantiatedRouteMap.get(path);
			this.pathToInstantiatedRouteMap.delete(path);
			if (instantiatedRoute == null) continue;

			// Otherwise, get the router view for the route and clear it
			try {
				const routerOutlet = this.getRouterOutletForRoute(instantiatedRoute.route, path);
				routerOutlet.clearRoute(instantiatedRoute.route);
			} catch {
				rafScheduler.mutate(() => {
					// This is okay
					if (instantiatedRoute.instance.parentNode != null) {
						if ("destroyedCallback" in instantiatedRoute.instance) {
							(<any>instantiatedRoute).instance.destroyedCallback();
						}
						instantiatedRoute.instance.parentNode.removeChild(instantiatedRoute.instance);
					}
				}, {instantIfFlushing: true});
			}
		}
	}

}