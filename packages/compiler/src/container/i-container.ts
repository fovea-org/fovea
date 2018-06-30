import MagicString, {MagicStringOptions} from "magic-string";
import {IPlacement} from "@wessberg/codeanalyzer";

export interface IContainer extends MagicString {
	readonly file: string;
	hasChanged: boolean;
	appendAtPlacement (content: string, placement: IPlacement): void;
}

export interface IContainerConstructor {
	new (content: string, options: MagicStringOptions): IContainer;
}