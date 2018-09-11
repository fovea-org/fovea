// Import the AppComponent, the base component for the App
import {AppComponent} from "./component/app/app-component";
// Import the ServiceWorker registration function
import {registerServiceWorker} from "./serviceworker/register";

if ("ontouchstart" in document) {
	// Disable context menu
	document.addEventListener("contextmenu", e => e.preventDefault());
}

/**
 * Append the AppComponent to the DOM.
 */
document.body.appendChild(new AppComponent());

/**
 * Register a ServiceWorker
 */
registerServiceWorker();