/**
 * Provide the default values for each environment variable in case the values
 * isn't provided by the build environment
 */
export const environmentDefaults = {
	NODE_ENV: "development",
	NPM_PACKAGE_NAME: "",
	NPM_PACKAGE_DESCRIPTION: "",
	NPM_PACKAGE_VERSION: "",
	MODULE_KIND: "",
	WATCH: "",
	TAG: "",
	RESOURCE: "{}",
	HASH: ""
};
