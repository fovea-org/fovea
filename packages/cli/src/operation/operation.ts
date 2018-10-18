export enum OperationKind {
	START = "START",
	ERROR = "ERROR",
	END = "END"
}

export interface IOperation {
	kind: OperationKind;
}

export interface IOperationStart extends IOperation {
	kind: OperationKind.START;
}

export interface IOperationEnd<T> extends IOperation {
	kind: OperationKind.END;
	data: T;
}

export type Operation<T> = IOperationStart|IOperationEnd<T>;

export const OPERATION_START: () => IOperationStart = () => ({kind: OperationKind.START});
export const OPERATION_END: () => IOperationEnd<void> = () => ({kind: OperationKind.END, data: undefined});