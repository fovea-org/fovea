import {ITemplatorGenerateOptions} from "./i-templator-generate-options";
import {IRegisterResult} from "./i-register-result";
import {IUseItem} from "@fovea/common";
import {ITemplatorRegisterOptions} from "./i-templator-register-options";

export declare type RegisterMethod = (options: ITemplatorRegisterOptions, content: string, resolvedPath: string) => Promise<IRegisterResult>;
export declare type UseMethod = (options: ITemplatorGenerateOptions, items: IUseItem[]) => void;
export declare type UseForeignMethod = (options: ITemplatorGenerateOptions, resolvedPath: string, referencedAs: "styles"|"template") => void;
export declare type HashFunction = (resolvedPath: string) => string;

export interface ITemplator {
	registerTemplate: RegisterMethod;
	registerStyles: RegisterMethod;
	use: UseMethod;
	useForeign: UseForeignMethod;
	generateStylesHash: HashFunction;
	generateTemplateHash: HashFunction;
	generateTemplates (options: ITemplatorGenerateOptions): Promise<void>;
	generateStyles (options: ITemplatorGenerateOptions): Promise<void>;
}