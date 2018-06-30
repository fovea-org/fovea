import {IContext} from "../context-util/i-context";

export interface IExpressionContentPart {
	expression: string;
	stringify (templateVariables: string[]): string;
	observerKey: string;
	isHostIdentifier (templateVariables: string[]): boolean;
	isTemplateVariable (templateVariables: string[]): boolean;
}

export interface IExpressionContentPartMetadata extends IContext {
	isAsync: boolean;
}

export interface IGenerateExpressionContentResult extends IExpressionContentPartMetadata {
	expressions: IExpressionContentPart[];
}