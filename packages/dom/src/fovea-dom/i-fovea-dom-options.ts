import {IHostAttributeValues} from "@fovea/common";

export interface IFoveaDOMBaseOptions {
	dryRun?: boolean;
}

export interface IFoveaTemplateDOMOptions extends IFoveaDOMBaseOptions {
	template: string;
	skipTags?: Set<string>;
}

export interface IFoveaHostAttributesDOMOptions extends IFoveaDOMBaseOptions {
	hostAttributes: IHostAttributeValues;
}

export declare type FoveaDOMOptions = IFoveaTemplateDOMOptions|IFoveaHostAttributesDOMOptions;