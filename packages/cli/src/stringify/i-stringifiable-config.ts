import {IStringifiable} from "./i-stringifiable";

export interface IStringifiableConfig<T> extends IStringifiable {
	config: T;
}