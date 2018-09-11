/// <reference path="./workbox-sw.d.ts" />
// This file contains the Workbox routing configuration for your app

// Load the config
import {config} from "../config/config";
import {get, set} from "idb-keyval";

// Serve index from the network first
workbox.routing.registerRoute(
	({url}) => url.pathname === "/",
	workbox.strategies.networkFirst({})
);

// Resolve requests to Photon.sh's syntax highlighting server to avoid sending unnecessary requests
workbox.routing.registerRoute(
	"https://api.photon.sh/snippets",
	async args => {
		// Clone the request
		const clone = args.event.request.clone();
		// Take the clone's text content
		const text = await clone.text();
		// Hash the text
		const hashed = btoa(text);

		// Resolve the entry from the cache
		let cacheEntry = await get<string>(hashed);

		// If there is no entry within the cache, execute the request, and store the response within the cache
		if (cacheEntry == null) {
			const handledRequest = await new workbox.strategies.NetworkOnly().handle(args);
			const responseText = await handledRequest.text();
			await set(hashed, responseText);
			cacheEntry = responseText;
		}

		// Resolve with a new Response
		return new Response(cacheEntry, {
			headers: {
				"Content-Type": "text/html",
				"status": "200"
			}
		});
	}, "POST"
);

// Serve every other resource from the cache only
workbox.routing.registerRoute(
	({url}) => url.pathname !== "/",
	config.WATCH
		? workbox.strategies.networkFirst({})
		: // Always use the cache first when not in WATCH mode
		workbox.strategies.cacheFirst({})
);
