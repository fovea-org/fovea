/// <reference path="./workbox-sw.d.ts" />
// This file contains the Workbox precaching configuration for your app
import {config} from "../config/config";

// Precache and serve each route
workbox.precaching.precacheAndRoute([
	config.RESOURCE.output.manifestJson,
	...Object.values(config.RESOURCE.output.chunk),
	...Object.values(config.RESOURCE.output.asset.appIcon),
	...Object.values(config.RESOURCE.output.asset.other)
]);
