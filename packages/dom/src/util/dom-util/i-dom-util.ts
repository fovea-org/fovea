import {IDOMElementHandlerResult} from "../../dom/dom-handler/dom-element-handler/i-dom-element-handler-result";
import {LibHelperName} from "@fovea/common";
import {IContext} from "../context-util/i-context";

export interface IDOMUtil {
	readonly selfReferenceNodeName: string;
	emptyResult: IDOMElementHandlerResult;
	useHelper (helperName: LibHelperName, context: IContext): string;
	mergeInstructions (a: IDOMElementHandlerResult, b: Partial<IDOMElementHandlerResult>): IDOMElementHandlerResult;
	isBuiltInSelector (selector: string): boolean;
	isPreserveWhitespaceNodeName (nodeName: string): boolean;
	isPreserveFormattingNodeName (nodeName: string): boolean;
}