import {ITypeExtractorService} from "./i-type-extractor-service";
import {IType} from "@fovea/common";
import {removeWhitespace} from "@wessberg/stringutil";

/**
 * A Service that helps with computing as much info as possible about a type
 * such that the information is available at runtime without the need for further parsing
 */
export class TypeExtractorService implements ITypeExtractorService {
	/**
	 * A Regular Expression for matching the different parts of a type
	 * @type {RegExp}
	 */
	private readonly TYPE_SEPARATOR_REGEX: RegExp = /[|&]/;

	/**
	 * Gets a Type from the given raw string representing a type
	 * @param {string} raw
	 * @returns {IType}
	 */
	public getType (raw: string): IType {

		// Get an array of the parts of the type (separated by "|" or "&")
		const splitted = raw.split(this.TYPE_SEPARATOR_REGEX)
			.map(part => removeWhitespace(part.toLowerCase()))
			.filter(part => part.length > 0);

		const nonNullableTypes = splitted.filter(type => type !== "null" && type !== "undefined");

		return {
			nonNullableTypes
		};
	}
}