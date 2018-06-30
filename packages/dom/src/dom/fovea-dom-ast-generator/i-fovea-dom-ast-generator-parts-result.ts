import {Ref} from "@fovea/common";
import {IFoveaDOMAstAttribute, IFoveaDOMAstCustomAttribute, IFoveaDOMAstListener} from "../fovea-dom-ast/i-fovea-dom-ast";

export interface IFoveaDOMAstGeneratorPartsResult {
	customAttributes: IFoveaDOMAstCustomAttribute[];
	listeners: IFoveaDOMAstListener[];
	ref: Ref|null;
	attributes: IFoveaDOMAstAttribute[];
}