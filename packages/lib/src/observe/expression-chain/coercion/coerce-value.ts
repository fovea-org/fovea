import {IType, Json, Optional} from "@fovea/common";

const SYMBOL_REGEX: RegExp = /Symbol\(([^)]*)\)/;

/**
 * Coerces the given value to a number
 * @param {Json} value
 * @returns {Optional<number>}
 */
function coerceToNumber (value: Json): Optional<number> {
	if (typeof value === "number") return value;
	else if (value instanceof Number) return value.valueOf();
	else if (value === true) return 1;
	else if (value === false) return 0;
	else if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;
	return parseFloat(value);
}

/**
 * Coerces the given value to a boolean
 * @param {Json} value
 * @returns {Optional<boolean>}
 */
function coerceToBoolean (value: Json): Optional<boolean> {
	if (typeof value === "boolean") return value;
	else if (value instanceof Boolean) return value.valueOf();
	else if (value === 1) return true;
	else if (value === 0) return false;
	if (value === "" || value === "1" || value === "true") return true;
	if (value === "0" || value === "false") return false;
	else if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;
	return Boolean(value);
}

/**
 * Coerces the given value to a string
 * @param {Json} value
 * @returns {Optional<string>}
 */
function coerceToString (value: Json): Optional<string> {
	if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;

	else if (typeof value === "string") return value;
	return value.toString();
}

/**
 * Coerces the given value to a symbol
 * @param {Json} value
 * @returns {Optional<symbol>}
 */
function coerceToSymbol (value: Json): Optional<symbol> {
	if (typeof value === "symbol") return value;
	const stringifiedSymbolMatch = typeof value !== "string" ? null : value.match(SYMBOL_REGEX);
	if (stringifiedSymbolMatch != null) return Symbol(stringifiedSymbolMatch[1]);

	if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;

	return Symbol(value);
}

/**
 * Coerces the given value to a RegExp
 * @param {Json} value
 * @returns {Optional<RegExp>}
 */
function coerceToRegExp (value: Json): Optional<RegExp> {
	if (value instanceof RegExp) return value;

	else if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;

	// Try to parse a Regular Expression from the given string
	if (typeof value === "string") {
		// Make sure that the string is surrounded with forward slashes
		const valuePrefix = value.startsWith("/") ? "" : "/";
		const valueSuffix = value.endsWith("/") ? "" : "/";
		const normalizedValue = `${valuePrefix}${value}${valueSuffix}`;
		const flags = normalizedValue.replace(/.*\/([gimyus]*)$/, "$1");
		const pattern = normalizedValue.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1");
		return new RegExp(pattern, flags);
	}
	return new RegExp(value);
}

/**
 * Coerces the given value to a Date
 * @param {Json} value
 * @returns {Optional<Date>}
 */
function coerceToDate (value: Json): Optional<Date> {
	if (value instanceof Date) return value;

	else if (value === undefined || value === "undefined") return undefined;
	else if (value === null || value === "null") return null;

	return new Date(value);
}

/**
 * Coerces a single type such as "any", "string" or "boolean"
 * @param {Json} value
 * @param {string} typeName
 * @returns {Json}
 */
function coerceSingleType (value: Json, typeName: string): Json {
	if (typeName === "number") {
		return coerceToNumber(value);
	}

	else if (typeName === "boolean") {
		return coerceToBoolean(value);
	}

	else if (typeName === "true") {
		return true;
	}

	else if (typeName === "false") {
		return false;
	}

	else if (typeName === "string") {
		return coerceToString(value);
	}

	else if (typeName === "symbol") {
		return coerceToSymbol(value);
	}

	else if (typeName === "regexp") {
		return coerceToRegExp(value);
	}

	else if (typeName === "date") {
		return coerceToDate(value);
	}

	else {
		return value;
	}
}

/**
 * Coerces the given value into the given data type
 * @param {Json} value
 * @param {IType} type
 * @returns {Json}
 */
export function coerceValue (value: Json, type: IType): Json {
	// If there is no non-nullable types, return the value itself
	if (type.nonNullableTypes.length === 0) {
		return value;
	}

	// If there is one non-nullable type, try to coerce it
	if (type.nonNullableTypes.length === 1) {
		return coerceSingleType(value, type.nonNullableTypes[0]);
	}

	// Don't coerce multi-type values. There are too many complexities in play.
	// For example, how do you coerce "string|boolean" Does the string "true" represent the string or the boolean literal value true then?
	else {
		return value;
	}
}