import {ICustomAttributeConstructor} from "@fovea/common";

/*# IF hasTemplateCustomAttributes */

/**
 * A class that can define and get Custom Attributes
 */
export class CustomAttributeRegistry {

	/**
	 * A Map between custom attribute names and their constructors
	 * @type {Map<string, ICustomAttributeConstructor>}
	 */
	private readonly customAttributes:  Map<string, ICustomAttributeConstructor> = new Map();
	/**
	 * Defines a new Custom Attribute
	 * @param {string} name
	 * @param {ICustomAttributeConstructor} host
	 */
	public define (name: string, host: ICustomAttributeConstructor): void {
		// Assert that it hasn't been registered before
		if (this.customAttributes.has(name)) {
			throw new TypeError(`Internal Error: A Custom Attribute is already registered with the name: "${name}"`);
		}
		this.customAttributes.set(name, host);
	}

	/**
	 * Gets the ICustomAttributeConstructor with the given name
	 * @param {string} name
	 * @returns {ICustomAttributeConstructor | undefined}
	 */
	public get (name: string): ICustomAttributeConstructor|undefined {
		return this.customAttributes.get(name);
	}
} /*# END IF hasTemplateCustomAttributes */