import {ICustomElement, ICustomElementConstructor} from "../custom-element/i-custom-element";
import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

export type FoveaHost = ICustomElement|ICustomAttribute;
export type FoveaHostConstructor = ICustomElementConstructor|ICustomAttributeConstructor;