import {ExpressionChain, IType} from "@fovea/common";

export interface IUpgradedExpressionAddition {
	isAsync: boolean;
	coerceTo: IType;
}

export declare type UpgradedExpressionChain = ExpressionChain&IUpgradedExpressionAddition;