// This file will register a ServiceWorker
import {config} from "../config/config";

/**
 * Registers a ServiceWorker if the environment supports it
 */
export async function registerServiceWorker (): Promise<void> {
	if ("serviceWorker" in navigator) {
		await window.navigator.serviceWorker.register(
			config.RESOURCE.output.chunk.serviceWorker
		);
	}
}
