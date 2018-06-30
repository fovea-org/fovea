
import {ChangeKind} from "../change-kind/change-kind";

export declare type ChangePath = (string|number)[];

export interface IChange<T> {
	kind: ChangeKind;
	path: ChangePath;
	target: T;
	originalTarget: T;
	property: string|number;
}

export interface IArrayChange<T, U extends Iterable<T> = T[]> extends IChange<U> {
	property: number;
}

export interface IArrayUpdateChange<T> extends IArrayChange<T> {
	kind: ChangeKind.UPDATE;
	newValue: T;
}

export interface IArrayPopChange<T> extends IArrayChange<T> {
	kind: ChangeKind.POP;
}

export interface IArraySpliceChange<T> extends IArrayChange<T> {
	kind: ChangeKind.SPLICE;
	newValue: T;
}

export declare type ArrayChange<T> = IArrayUpdateChange<T>|IArraySpliceChange<T>|IArrayPopChange<T>;

export interface IObjectChange<T> extends IChange<T> {
}

export interface IObjectUpdateChange<T> extends IObjectChange<T> {
	kind: ChangeKind.UPDATE;
	newValue: T[keyof T];
}

export declare type ObjectChange<T> = IObjectUpdateChange<T>;
export declare type Change<T> = ObjectChange<T>|ArrayChange<T>;