import {IDOMAttributeMutationPayload} from "./i-dom-attribute-mutation-payload";

export declare type DOMAttributeCallback = (attribute: IDOMAttributeMutationPayload) => void|Promise<void>;