export interface IEnvironmentDefaults {
	[key: string]: string;
	NODE_ENV: string;
	NPM_PACKAGE_NAME: string;
	NPM_PACKAGE_DESCRIPTION: string;
	NPM_PACKAGE_VERSION: string;
	MODULE_KIND: string;
	WATCH: string;
	TAG: string;
	RESOURCE: string;
}

export declare type PartialEnvironmentDefaults = Partial<IEnvironmentDefaults> & {[key: string]: string};