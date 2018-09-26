import {Uuid} from "../uuid/uuid";

export interface INodeExtension {
	___root: Element|ShadowRoot;
	___uuid: Uuid;
}