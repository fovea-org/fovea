import {Options} from "prettier";

export type ConvertKey<T, K extends keyof T, J> = {
	[Key in keyof T]: Key extends K ? J : T[Key];
};

export interface IFormatterOptions extends ConvertKey<Options, "parser", Options["parser"] | "html"> {
}