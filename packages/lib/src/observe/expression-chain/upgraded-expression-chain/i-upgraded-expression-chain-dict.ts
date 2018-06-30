import {ExpressionChain} from "@fovea/common";

export interface IUpgradedExpressionAddition {
	isAsync: boolean;
}

export declare type UpgradedExpressionChain = ExpressionChain&IUpgradedExpressionAddition;