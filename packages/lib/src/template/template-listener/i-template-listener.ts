import {ExpressionChain} from "@fovea/common";

export interface ITemplateListener {
	name: string;
	handler: ExpressionChain;
}