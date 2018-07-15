import {IMeta} from "../../meta/i-meta";
import {DomGeneratorMode} from "../../dom/dom-generator-mode/dom-generator-mode";

export interface IContext extends IMeta {
	mode: DomGeneratorMode;
}