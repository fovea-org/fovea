import {ExpressionChain, ICustomAttribute} from "@fovea/common";

export interface ICustomAttributeTemplateResultOption {
	customAttribute: ICustomAttribute;
	valueExpression?: ExpressionChain;
}