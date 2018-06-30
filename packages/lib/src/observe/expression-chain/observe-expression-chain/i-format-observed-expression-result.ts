import {IObservedExpression} from "../observed-expression/i-observed-expression";

export interface IFormatObservedExpressionResult<T> {
	observerKey: string;
	observedExpression: IObservedExpression<T>;
}