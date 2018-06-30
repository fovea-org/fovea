import {FoveaDOMAst} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "../../../util/context-util/i-context";

export interface IDOMGeneratorOptions {
	skipTags: Set<string>;
	ast: FoveaDOMAst;
	context: IContext;
}