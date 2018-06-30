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

	constructor (private readonly hostElement: HTMLAnchorElement) {
	}

	/**
	 * Gets a proper URL from the href of the anchor tag
	 */
	private get url (): URL {
		return new URL(this.href);
	}

	/**
	 * Gets the href of the anchor tag
	 * @type {string}
	 */
	private get href (): string {
		return this.hostElement.href;
	}

	/**
	 * Gets the raw value of the 'href' attribute
	 * @type {string}
	 */
	private get rawHref (): string {
		return this.hostElement.getAttribute("href")!;
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
		if (Router.lastInstance == null) {
			throw new ReferenceError(`The element: '${this.hostElement.nodeName.toLowerCase()}', was annotated with a 'routerLink' Custom Attribute, but no Router was initialized!`);
		}

		// Detect whether to replace or push the route depending on the truth value of the "replace" @prop
		const routerMethod = this.replace ? "replace" : "push";

		// Treat hrefs starting with a '/' as path links
		if (this.rawHref.startsWith("/")) {
			// Navigate to the path identified by the anchor tag
			const {pathname, search} = this.url;
			await Router.lastInstance[routerMethod]({
				path: pathname,
				query: search,
				title: this.title
			});
		}

		// Otherwise, treat it as a name
		else {
			await Router.lastInstance[routerMethod]({
				name: this.rawHref,
				params: this.params,
				query: this.query,
				title: this.title
			});
		}
	}
}