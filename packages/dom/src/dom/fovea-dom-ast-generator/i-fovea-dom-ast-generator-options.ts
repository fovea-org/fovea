import {DOMAstRaw} from "../dom-ast-implementation/i-dom-ast-raw";
import {IContext} from "../../util/context-util/i-context";

export interface IFoveaDOMAstGeneratorOptions {
	ast: DOMAstRaw;
	context: IContext;
}