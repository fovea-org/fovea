import {customAttribute, listener, selector, prop} from "@fovea/core";
import {IRouterLink} from "./i-router-link";
import {Router} from "../router";
import {IParams} from "../../query/i-params";

/**
 * A RouterLink is a Custom Attribute that can annotate anchor tags
 */
@selector("router-link")
@customAttribute
export class RouterLink implements IRouterLink {
	/**
	 * The params to provide to the referenced path or name
	 * @type {IParams}
	 */
	@prop public params: IParams|undefined;

	/**
	 * The query to append to the URL
	 * @type {string}
	 */
	@prop public query: string|undefined;

	/**
	 * Whether or not to replace, rather than push, the new state to the history
	 * @type {boolean}
	 */
	@prop public replace: boolean = false;

	/**
	 * The document title to use for the new route
	 * @type {boolean}
	 */
	@prop public title: string;

	constructor (private readonly hostElement: HTMLElement) {
	}

	/**
	 * Gets a proper URL from the href of the anchor tag
	 */
	private get url (): URL {
		const href = this.href;
		// If the href only needs a protocol, add it to the href
		if (href.startsWith(location.host)) {
			return new URL(`${location.protocol}://${href}`);
		}

		else if (!href.startsWith("/")) {
			return new URL(`${location.origin}/${href}`);
		}

		else {
			return new URL(`${location.origin}${href}`);
		}
	}

	/**
	 * Gets the href of the anchor tag
	 * @type {string}
	 */
	private get href (): string {
		let candidate: string|null = null;

		if (candidate == null) {
			candidate = this.hostElement.getAttribute("href");
		}

		if (candidate == null) {
			candidate = this.hostElement.getAttribute("data-href");
		}

		if (candidate == null && "href" in this.hostElement) {
			candidate = (<HTMLAnchorElement> this.hostElement).href;
		}

		if (candidate == null) {
			throw new ReferenceError(`An element with selector: ${this.hostElement.nodeName.toLowerCase()} is annotated with a *routerLink Custom Attribute, but it didn't provide a href!`);
		}

		else {
			return candidate;
		}
	}

	/**
	 * Listen for 'click' events on the link and prevent the default action
	 * @param {MouseEvent} e
	 */
	@listener("click", {on: "this"})
	public async onClick (e: MouseEvent): Promise<void> {
		// Stop the event from bubbling and performing its default action
		e.preventDefault();
		e.stopPropagation();

		// Make sure that there is a Router
		if (!Router.initialized) {
			throw new ReferenceError(`The element: '${this.hostElement.nodeName.toLowerCase()}', was annotated with a 'routerLink' Custom Attribute, but the Router wasn't initialized!`);
		}

		// Detect whether to replace or push the route depending on the truth value of the "replace" @prop
		const routerMethod = this.replace ? "replace" : "push";
		const href = this.href;

		// Treat hrefs starting with a '/' as path links
		if (href.startsWith("/")) {
			// Navigate to the path identified by the anchor tag
			const {pathname, search} = this.url;
			await Router[routerMethod]({
				path: pathname,
				query: search,
				title: this.title
			});
		}

		// Otherwise, treat it as a name
		else {
			await Router[routerMethod]({
				name: href,
				params: this.params,
				query: this.query,
				title: this.title
			});
		}
	}
}