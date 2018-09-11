/// <reference path="./workbox-sw.d.ts" />
// This file will initialize Workbox
import {config} from "../config/config";
import {wipeCaches} from "./cleanup";

// Wipe all Cache Storage caches
wipeCaches();

// Load Workbox
importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

// Set the workbox environment
workbox.setConfig({debug: config.DEVELOPMENT});
// Set the log level to silent
workbox.core.setLogLevel(4);

// Activate the new ServiceWorker immediately and claim clients
workbox.skipWaiting();
workbox.clientsClaim();

// Set the name of the cache
workbox.core.setCacheNameDetails({
	precache: `precache-${config.TAG}-${config.HASH}`,
	runtime: `runtime-${config.TAG}-${config.HASH}`
});
