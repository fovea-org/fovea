import {environment} from "../environment/environment";
import {IResource} from "@fovea/cli";

/**
 * The app config. Contains environment variable values as well as additional configuration properties
 */
export const config = {
	...environment,
	PRODUCTION: environment.NODE_ENV === "production",
	DEVELOPMENT: environment.NODE_ENV === "development",
	STAGING: environment.NODE_ENV === "staging",
	RESOURCE: <IResource>JSON.parse(environment.RESOURCE),
	WATCH: environment.WATCH === "true",
	isESM: () => environment.MODULE_KIND === "es"
	// Add additional config properties here
};
