import {IMeta} from "../../meta/i-meta";
import {RawExpressionBindable} from "../../expression/raw-expression-bindable/raw-expression-bindable";

export interface IExpressionUtil {
	formatExpression (content: string, meta: IMeta): RawExpressionBindable|string;
}