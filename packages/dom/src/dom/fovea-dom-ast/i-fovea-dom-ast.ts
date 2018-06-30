import {RawExpressionChainBindable} from "../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";
import {RawExpressionBindable} from "../../expression/raw-expression-bindable/raw-expression-bindable";
import {IRawExpressionChainBindableDict} from "../../expression/i-raw-expression-chain-bindable-dict/i-raw-expression-chain-bindable-dict";

export interface IFoveaDOMAstAttribute {
	name: string;
	value: RawExpressionChainBindable|IRawExpressionChainBindableDict;
}

export interface IFoveaDOMAstListener {
	name: string;
	handler: RawExpressionChainBindable;
}

export interface IFoveaDOMAstCustomAttribute {
	name: string;
	value: RawExpressionChainBindable|IRawExpressionChainBindableDict;
}

export declare type FoveaDOMAstKind = "native"|"svg"|"custom"|"text"|"template";

export interface IFoveaDOMAstNode {
	type: FoveaDOMAstKind;
	isRootNode: boolean;
	parentNode: FoveaDOMAstNode|undefined;
	stringify (onlyInnerContent?: boolean): string;
	toString (): string;
}

export interface IFoveaDOMAstTagNodeBase extends IFoveaDOMAstNode {
	name: string;
	ref: string|null;
	attributes: IFoveaDOMAstAttribute[];
	customAttributes: IFoveaDOMAstCustomAttribute[];
	listeners: IFoveaDOMAstListener[];
	children: FoveaDOMAst;
}

export interface IFoveaDOMAstNativeElement extends IFoveaDOMAstTagNodeBase {
	type: "native";
}

export interface IFoveaDOMAstCustomElement extends IFoveaDOMAstTagNodeBase {
	type: "custom";
}

export interface IFoveaDOMAstSvgElement extends IFoveaDOMAstTagNodeBase {
	type: "svg";
}

export interface IFoveaDOMAstTextNode extends IFoveaDOMAstNode {
	type: "text";
	content: string|RawExpressionBindable;
}

export declare type FoveaDOMAstHTMLElement = IFoveaDOMAstNativeElement|IFoveaDOMAstCustomElement;
export declare type FoveaDOMAstElement = FoveaDOMAstHTMLElement|IFoveaDOMAstSvgElement;
export declare type FoveaDOMAstNode = FoveaDOMAstElement|IFoveaDOMAstTextNode;
export declare type FoveaDOMAst = FoveaDOMAstNode[];