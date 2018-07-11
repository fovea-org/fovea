export interface IHostAttributeValues {
	[key: string]: string|{ [key: string]: string };
}

export interface IFoveaDOMBaseOptions {
	dryRun?: boolean;
}

export interface IFoveaDOMOptions extends IFoveaDOMBaseOptions {
	template: string;
	skipTags?: Set<string>;
}