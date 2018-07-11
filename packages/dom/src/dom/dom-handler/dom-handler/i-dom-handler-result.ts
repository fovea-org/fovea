import {IDOMHandlerAppendResult} from "./i-dom-handler-append-result";
import {IDOMHandlerCreateResult} from "./i-dom-handler-create-result";
import {NodeUuid} from "../../node-uuid/node-uuid";

export interface IDOMHandlerResult {
	createInstructions: IDOMHandlerCreateResult[];
	appendInstructions: IDOMHandlerAppendResult[];
	rootIdentifiers?: NodeUuid[];
}