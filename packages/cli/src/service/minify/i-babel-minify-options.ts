import {JSONValue} from "@fovea/common";

export interface IBabelMinifySharedOptions {
	tdz: boolean;
	topLevel: boolean;
	keepFnName: boolean;
	keepClassName: boolean;
}

export interface IBabelMinifyBuiltInsOptions {
	tdz: boolean;
}

export interface IBabelMinifyDeadCodeOptions extends IBabelMinifyBuiltInsOptions {
	keepFnName: boolean;
	keepFnArgs: boolean;
	keepClassName: boolean;
}

export interface IBabelMinifyConstantFoldingOptions extends IBabelMinifyBuiltInsOptions {
}

export interface IBabelMinifyMangleOptions {
	exclude: {[key: string]: boolean};
	eval: boolean;
	keepFnName: boolean;
	keepClassName: boolean;
	topLevel: boolean;
}

export interface IBabelMinifyConsoleOptions {
	exclude: string[];
}

export interface IBabelMinifyRemoveUndefinedOptions extends IBabelMinifyBuiltInsOptions {
}

export interface IBabelMinifyRemoveUndefinedOptions extends IBabelMinifyBuiltInsOptions {
}

export interface IBabelMinifyReplaceOptions {
	replacements: {
		identifierName: string;
		replacement: {
			type: string;
			value: JSONValue;
		};
	}[];
}

export interface IBabelMinifyTypeConstructorsOptions {
	array: boolean;
	boolean: boolean;
	number: boolean;
	object: boolean;
	string: boolean;
}

export interface IBabelMinifyOptions extends Partial<IBabelMinifySharedOptions> {
	booleans?: boolean;
	builtIns?: boolean|Partial<IBabelMinifyBuiltInsOptions>;
	consecutiveAdds?: boolean;
	deadcode?: boolean|Partial<IBabelMinifyDeadCodeOptions>;
	evaluate?: boolean|Partial<IBabelMinifyConstantFoldingOptions>;
	flipComparisons?: boolean;
	guards?: boolean;
	infinity?: boolean;
	mangle?: boolean|Partial<IBabelMinifyMangleOptions>;
	memberExpressions?: boolean;
	mergeVars?: boolean;
	numericLiterals?: boolean;
	propertyLiterals?: boolean;
	regexpConstructors?: boolean;
	removeConsole?: boolean|Partial<IBabelMinifyConsoleOptions>;
	removeDebugger?: boolean;
	removeUndefined?: boolean|Partial<IBabelMinifyRemoveUndefinedOptions>;
	replace?: boolean|Partial<IBabelMinifyReplaceOptions>;
	simplify?: boolean;
	simplifyComparisons?: boolean;
	typeConstructors?: boolean|Partial<IBabelMinifyTypeConstructorsOptions>;
	undefinedToVoid?: boolean;
}