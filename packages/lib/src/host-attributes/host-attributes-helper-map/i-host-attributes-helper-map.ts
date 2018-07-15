import {ExpressionChain, ICustomAttribute, IFoveaHost, Ref} from "@fovea/common";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {IObserver} from "../../observe/i-observer";

export interface IHostAttributesHelperMap {
	__addAttributes (host: IFoveaHost|ICustomAttribute, ...attributes: [string, ExpressionChain|undefined][]): IObserver;
	__addAttribute (host: IFoveaHost|ICustomAttribute, key: string, value?: ExpressionChain|IExpressionChainDict): IObserver;
	__addProperties (host: IFoveaHost|ICustomAttribute, ...properties: [string, ExpressionChain][]): IObserver;
	__addProperty (host: IFoveaHost|ICustomAttribute, path: string, value?: ExpressionChain): IObserver;
	__addListeners (host: IFoveaHost|ICustomAttribute, ...listeners: [string, ExpressionChain][]): IObserver;
	__addListener (host: IFoveaHost|ICustomAttribute, name: string, handler: ExpressionChain): IObserver;
	__addRef (host: IFoveaHost|ICustomAttribute, ref: Ref): IObserver;
	__addCustomAttribute (host: IFoveaHost|ICustomAttribute, name: string, value?: ExpressionChain|IExpressionChainDict): IObserver;
}