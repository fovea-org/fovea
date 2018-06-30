import {IParams} from "../query/i-params";

/**
 * Converts the given IParams into URLSearchParams
 * @param {IParams} params
 */
export function paramsToURLSearchParams (params: IParams): URLSearchParams {
	const urlSearchParams = new URLSearchParams();
	Object.entries(params).forEach(([paramName, paramValue]) => {
		urlSearchParams.set(paramName, `${paramValue}`);
	});
	return urlSearchParams;
}

/**
 * Normalizes query parameters from the given query
 * @param {URL|string|IParams} query
 */
export function normalizeQueryParams (query: URL|string|IParams): IParams {
	if (typeof query === "string" || query instanceof URL) {
		return normalizeParams(typeof query === "string" ? query : query.searchParams.toString());
	}

	return query;
}

/**
 * Normalizes the given parameters
 * @param stringifiedParams
 * @returns {IParams}
 */
export function normalizeParams (stringifiedParams: string|{[key: string]: string}): IParams {
	const normalizedParams: IParams = {};
	let entries: [string, string][];

	// If the given params is a string, convert it to URLSearchParams and take the entries
	if (typeof stringifiedParams === "string") {
		const urlSearchParams = new URLSearchParams(stringifiedParams);
		entries = [...urlSearchParams.entries()];
	}

	// Otherwise, take the entries of the given dictionary
	else {
		entries = Object.entries(stringifiedParams);
	}

	entries.forEach(([paramName, paramValue]) => {
		normalizedParams[paramName] = paramValue;
	});
	return normalizedParams;
}