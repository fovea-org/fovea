import {FoveaDOMAstNode} from "../../dom/fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "./i-context";
import {HostIdentifier} from "@fovea/common";

export interface IContextUtil {
	getContextForNode (node: FoveaDOMAstNode): IContext;
	addContextForNode (node: FoveaDOMAstNode, context: IContext): void;
	disposeContextForNode (node: FoveaDOMAstNode): void;
	getTemplateVariablesForNode (node: FoveaDOMAstNode): string[];
	addTemplateVariablesForNode (node: FoveaDOMAstNode, templateVariables: Iterable<string>): void;
	disposeTemplateVariablesForNode (node: FoveaDOMAstNode): void;
	getAdditionalHostIdentifiersForTemplateVariableForNode (node: FoveaDOMAstNode, templateVariable: string): HostIdentifier[];
	getAdditionalHostIdentifiersForNode (node: FoveaDOMAstNode): Map<string, HostIdentifier[]>;
	addAdditionalHostIdentifiersForTemplateVariableForNode (node: FoveaDOMAstNode, templateVariable: string, hostIdentifiers: Iterable<HostIdentifier>): void;
	disposeAdditionalHostIdentifiersForNode (node: FoveaDOMAstNode): void;
}