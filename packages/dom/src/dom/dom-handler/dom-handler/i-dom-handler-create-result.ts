import {NodeUuid} from "../../node-uuid/node-uuid";

export interface IDOMHandlerCreateResult {
	instruction: string;
	identifier: NodeUuid;
}