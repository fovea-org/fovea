import {ITemplateProperty} from "../../template-property/i-template-property";
import {ITemplateListener} from "../../template-listener/i-template-listener";
import {ExpressionChain, Ref} from "@fovea/common";
import {TemplateNode} from "../../node/template-node";
import {TemplateElementResult} from "../../template-result/template-result/template-element-result";
import {ITemplateBase} from "../../template-base/i-template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";
import {IExpressionChainDict} from "../../../observe/expression-chain/i-expression-chain-dict";
import {ITemplateCustomAttributeProperty} from "../../template-property/i-template-custom-attribute-property";

export interface ITemplateElement extends ITemplateBase {
	namespace: string|null;
	selector: string;
	ref: Ref|null;
	children: TemplateNode[];
	attributes: ITemplateProperty[];
	customAttributes: ITemplateCustomAttributeProperty[];
	listeners: ITemplateListener[];
	properties: ITemplateProperty[];
	addRef (ref: Ref): void;
	appendChild (child: TemplateNode): void;
	addCustomAttribute (name: string, value?: ExpressionChain|IExpressionChainDict): void;
	addAttribute (key: string, value?: ExpressionChain|IExpressionChainDict): void;
	setProperty (key: string, value?: ExpressionChain): void;
	addListener (name: string, handler: ExpressionChain): void;
	construct (options: ITemplateConstructOptions): TemplateElementResult;
}